/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * SWF9 Generation
 *
 * @author dda@ddanderson.com
 * @author ptw@openlaszlo.org
 * @description: JavaScript -> ActionScript3 translator, calling AS3 compiler -> SW9 
 *
 */

package org.openlaszlo.sc;
import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.openlaszlo.sc.parser.*;
import org.openlaszlo.server.LPS;

/**
 * The SWF9Generator generates ECMAScript 4 compliant code as
 * output.  This differs from our output for generic Javascript
 * (generated by JavascriptGenerator) in rather small ways, as
 * we currently strive to keep a lot of commonality in these
 * code bases.  For the moment, this generator extends JavascriptGenerator
 * and overrides only a small number of the visit functions to produce the
 * custom output we need.  The chief difference is generating the
 * output class definitions into individual files, and having a
 * postprocessing phase to call an external compiler to translate
 * these output files into a single SWF9 binary.
 */
public class SWF9Generator extends JavascriptGenerator {

  public static final String PASSTHROUGH_TOPLEVEL = "toplevel";



  /** The first part of a every emitted javascript file */
  public static final String DEFAULT_FILE_PREAMBLE = "package {\n";

  /** The final part of a every emitted javascript file */
  public static final String DEFAULT_FILE_EPILOG = "}\n";

  /**
   * Saved program node, to show during debugging
   */
  SimpleNode savedProgram = null;

  /**
   * Saved source, to show during debugging
   */
  String savedSource = null;

  /**
   * Any 'program' variables, which will become globals.
   */
  Map programVars = new HashMap();

  /**
   * Any classes are put here after translation.
   */
  Map classes = new HashMap();

  /**
   * The 'default' class is implicit and encompasses everything
   * not declared within an explicit 'class' definition.  This variable
   * is set when we are outside of explicit classes.
   *
   * Use of this variable to save state during 'visit' calls means that
   * visit methods are not reentrant.  This is not really
   * a new concern in the generators, as compiler options are often
   * twiddled as we parse.
   */
  boolean inDefaultClass = true;

  /*
   * inMethod is set when we are visiting any method.
   */
  boolean inMethod = false;

  /** values for the mixinRef map */
  class MixinReference {
    String mixinname;
    String supername;           // name of immediate super, may be interstitial
    String realsuper;           // name of closest non-interstitial super
    MixinReference(String m, String s, String r) {
      this.mixinname = m;
      this.supername = s;
      this.realsuper = r;
    }
  }

  /** maps name of mixin to SimpleNode */
  private Map mixinDef = new HashMap();

  /** This map lists the interstitials (extra generated classes)
   * needed to implement the mixins as used by the program.
   * The key of the map is the name of interstitial class,
   * and the data for each key is a MixinReference.
   * Example 1: 'class C1 extends S1 with M1'
   *      M1$S1 => { M1, S1 }
   * Example 2: 'class C2 extends S2 with M2, M3, M4'
   *      M2$M3$M4$S2 => { M2, M3$M4$S2 }
   *      M3$M4$S2 => { M3, M4$S2 }
   *      M4$S2 => { M4, S2 }
   * Example 3: 'class C3 with M5, M6'
   *      M6$ => { M6, null }
   *      M5$M6$ => { M5, M6$ }
   */
  private Map mixinRef = new HashMap();

  // override superclass version - we do not want the
  // generator to replace optional function parameters
  // or variable arguments (e.g. function f(a1, a2=0, a3=0, ...rest)),
  // we want to pass them right through to the backend compiler.
  //
  public SimpleNode formalArgumentsTransformations(SimpleNode n) {
    return n;
  }

  public void setGeneratorOptions() {
    options.putBoolean(Compiler.PASSTHROUGH_FORMAL_INITIALIZERS, true);
    // Inhibit function names because swf9 JIT seems to choke on them
    // with a verify error the second time a named function is called
    // dynamically
    options.putBoolean(Compiler.DEBUG_SIMPLE, true);
  }

  /**
   * The script compiler reserves parts of the name space for
   * its own use.  All of our generated names start with "$lzsc$",
   * to be conservative, we do not allow class/mixin names
   * that begin with dollar signs.
   * @param name class name to check
   * @throw CompilerError if name has a potential conflict
   */
  public void checkClassName(String name) {
    if (name.startsWith("$")) {
      // TODO: [2008-3-27 dda] This test should be for names that
      //      users pick.  We are using some names internally that
      //      don't yet pass this test, so this check commented for now.
      //      throw new CompilerError(name + ": class or mixin name may conflict with internally generated names");
    }
  }

  // override superclass method.
  // For SWF9, we need to preserve
  // the class definition, rather than converting it to
  // a function call to dynamically create the class.

  public SimpleNode visitClassDefinition(SimpleNode node, SimpleNode[] children) {
    boolean isClass = "class".equals(((ASTIdentifier)children[0]).getName());
    ASTIdentifier classname = (ASTIdentifier)children[1];
    String classnameString = classname.getName();
    SimpleNode superclass = children[2];
    SimpleNode mixins = children[3];

    checkClassName(classnameString);
    String supername = (superclass instanceof ASTEmptyExpression) ? null :
      ((ASTIdentifier)superclass).getName();
    SimpleNode mixinInterface = null;

    if (!isClass) {
      if (!(mixins instanceof ASTEmptyExpression)) {
        // In theory it's possible to support mixins with mixins,
        // but SWF8/DHTML don't, and is it useful?
        throw new CompilerError("mixins not allowed with mixins");
      }
      if (supername != null) {
        // It's probably easy to allow mixins to extend classes
        // or other mixins, but it's not supported yet.
        throw new CompilerError("mixins cannot extend anything");
      }
    }

    if (!(mixins instanceof ASTEmptyExpression)) {
      // create reference to mixin classes
      int nmixins = mixins.size();
      String superiname = supername; // iname == 'interstitial name'
      String suffix = (supername == null) ? "" : supername;
      String realsuper = supername;
      for (int i=nmixins-1; i>=0; i--) {
        String mixinname = ((ASTIdentifier)mixins.get(i)).getName();
        suffix = mixinname + "$" + suffix;
        String iname = "$lzsc$mixin$" + suffix;
        mixinRef.put(iname, new MixinReference(mixinname, superiname, realsuper));
        superiname = iname;
      }
      children[2] = newIdentifier(superiname);
      children[3] = newIdentifier(null);
    }
    boolean savedInDefault = inDefaultClass;
    inDefaultClass = false;
    try {
      // Both classes and mixins are translated to create a normal
      // 'implementation' class.  A mixin's implementation is stashed
      // into the mixinDef hashmap and is used to create interstitials
      // for use by any mixin client.  But the mixin's implementation
      // will not appear directly in the parse tree.  However, a mixin
      // is translated a second time here to create its interface,
      // and that's the part that remains in the parse tree and gets
      // emitted.
      //
      if (!isClass) {
        // before visiting, create a copy of the mixin for the interface
        mixinInterface = node.deepCopy();
      }
      translateClassDefinition(node, classnameString, TranslateHow.AS_CLASS);

      if (!isClass) {
        mixinDef.put(classnameString, node);
        node = mixinInterface;  // the interface will appear in the final tree
        translateClassDefinition(node, classnameString, TranslateHow.AS_INTERFACE);
      } else {
        classes.put(classnameString, node);
      }
    }
    finally {
      inDefaultClass = savedInDefault;
    }
    return node;
  }

  public void translateClassDefinition(SimpleNode node, String classnameString, TranslateHow how)
  {
    SimpleNode[] children = node.getChildren();
    SimpleNode[] dirs = (SimpleNode [])(Arrays.asList(children).subList(4, children.length).toArray(new SimpleNode[0]));
    List stmts = new ArrayList();

    translateClassDirectivesBlock(dirs, classnameString, null, null, stmts, how);

    // Plug the stmt children we found back into this node's children
    SimpleNode[] newch = new SimpleNode[stmts.size() + 4];
    int i;
    for (i=0; i<4; i++)
      newch[i] = children[i];
    for (Iterator iter = stmts.iterator(); iter.hasNext(); ) {
      SimpleNode n = (SimpleNode)iter.next();
      newch[i++] = visitStatement(n);
    }
    node.setChildren(newch);
  }

  /**
   * Intercept JavascriptGenerator version.
   * SWF9 does super calls 'normally' just by keeping the super keyword.
   * Other runtimes transform super into a runtime calculation of the
   * proper class to use; except for the special translation of
   * `super.setAttribute`
   */
  public SimpleNode translateSuperCallExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode fname = children[0];
    if (fname instanceof ASTIdentifier) {
      String name = ((ASTIdentifier)fname).getName();
      // Transform `super.setAttribute` to a setter method call
      if ("setAttribute".equals(name)) {
        assert children.length == 3;
        SimpleNode callapply = children[1];
        assert callapply instanceof ASTEmptyExpression;
        SimpleNode args = children[2];
        Map map = new HashMap();
        SimpleNode sargs[] = args.getChildren();
        assert sargs.length == 2;
        SimpleNode property = sargs[0];
        SimpleNode value = sargs[1];
        String pattern;
        if (property instanceof ASTLiteral) {
          name = "$lzc$set_" + (String)((ASTLiteral)property).getValue();
          pattern = "super._1(_2)";
          map.put("_1", new ASTIdentifier(name));
        } else {
          pattern = "super['$lzc$set_' + _1](_2)";
          map.put("_1", property);
        }
        map.put("_2", value);
        return (new Compiler.Parser()).substitute(node, pattern, map);
      }
    }
    return node;
  }

  /**
   * Intercept JavascriptGenerator version.
   * We pass through 'cast' and 'is' keywords without modification.
   * 'cast' will be transformred to 'as' on output.
   */
  public SimpleNode visitBinaryExpressionSequence(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    ASTOperator op = (ASTOperator)children[1];
    if (ParserConstants.CAST ==  op.getOperator() ||
        ParserConstants.IS ==  op.getOperator()) {
      children[0] = visitExpression(children[0]);
      children[2] = visitExpression(children[2]);
      return node;
    }
    else {
      return super.visitBinaryExpressionSequence(node, isReferenced, children);
    }
  }

  /**
   * Intercept JavascriptGenerator version.
   * We keep track of variables that are implicitly global.
   */
  public SimpleNode visitVariableStatement(SimpleNode node, SimpleNode[] children) {
    if (inDefaultClass && !inMethod &&
        children.length == 1 &&
        children[0] instanceof ASTVariableDeclaration) {
      // capture declarations for globals, they'll get into their own
      // program units.
      String initializer = null;
      SimpleNode[] varchildren = children[0].getChildren();
      if (varchildren.length > 1) {
        initializer = (new SWF9ParseTreePrinter()).text(varchildren[1]);
      }
      if (varchildren.length > 0) {
        ASTIdentifier id = (ASTIdentifier)varchildren[0];
        ASTIdentifier.Type type = id.getType();
        addGlobalVar(id.getName(), type == null ? null : type.toString(), initializer);
      }
      node = new ASTStatement(0);
      node.set(0, new ASTEmptyExpression(0));
      return node;
    }
    return super.visitVariableStatement(node, children);
  }

  public void setOriginalSource(String source) {
    savedSource = source;
  }

  /**
   * Intercept JavascriptGenerator version.
   * We preserve ModifiedDefinition nodes in our tree,
   * while other runtimes remove them for simplicity.
   */
  public SimpleNode visitModifiedDefinition(SimpleNode node, SimpleNode[] children) {
    assert children.length == 1;
    ((ASTModifiedDefinition)node).verifyTopLevel(children[0]);
    children[0] = visitStatement(children[0]);
    return node;
  }

  /**
   * Intercept JavascriptGenerator version.
   * We keep a copy of the original program so we can emit it
   * for debugging purposes.
   */
  public SimpleNode translate(SimpleNode program) {
    savedProgram = program;
    SimpleNode result = super.translate(program);

    // Walk list of needed interstitials and emit them
    for (Iterator iter = mixinRef.keySet().iterator(); iter.hasNext(); ) {
      String isname = (String)iter.next();
      MixinReference ref = (MixinReference)mixinRef.get(isname);
      SimpleNode mixin = (SimpleNode)mixinDef.get(ref.mixinname);
      if (mixin == null) {
        throw new CompilerError("Missing definition for mixin: " + ref.mixinname);
      }
      // We need the actual super class because we need
      // a trampoline to any constructor that it has.
      SimpleNode superClass = null;

      if (ref.realsuper != null) {
        superClass = (SimpleNode)classes.get(ref.realsuper);

        // If superClass is null, then we don't know anything about
        // it: it may be in an included library, etc.  For that case,
        // we currently require the caller to provide a constructor.
      }
      result.set(result.size(), createInterstitial(mixin, isname, ref, superClass));
    }
    return result;
  }

  SimpleNode newIdentifier(String name)
  {
    if (name == null) {
      return new ASTEmptyExpression(0);
    }
    ASTIdentifier id = new ASTIdentifier(0);
    id.setName(name);
    return id;
  }

  /**
   * For a class or mixin node, return the constructor
   * if there is one.  Throw an error if more than one
   * is found.
   * @param node class node, if null no constructor returned
   * @return a constructor, or null.
   */
  SimpleNode getConstructor(SimpleNode node) {
    SimpleNode result = null;
    if (node != null) {
      SimpleNode[] dirs = node.getChildren();
      for (int i = 0; i < dirs.length; i++) {
        SimpleNode n = dirs[i];

        if (n instanceof ASTModifiedDefinition) {
          n = n.get(0);
        }
        if (n instanceof ASTFunctionDeclaration) {
          ASTIdentifier fid = (ASTIdentifier)n.get(0);
          if (fid.isConstructor()) {
            if (result != null) {
              throw new CompilerError(fid.getName() + ": multiple constructors not allowed");
            }
            result = n;
          }
        }
      }
    }
    return result;
  }

  /**
   * Build a constructor function that is a 'trampoline' to its
   * superclass.
   * @param name name of new constructor function
   * @param formalList the formal arguments from super class
   * @param actuals the actual arguments for super(...)
   * @return AST for the new constructor function
   */
  SimpleNode buildTrampoline(String name, SimpleNode formalList, SimpleNode[] actuals) {
    // Build the super statement
    SimpleNode call = new ASTFunctionCallParameters(0);
    call.setChildren(actuals);
    SimpleNode expr = new ASTSuperCallExpression(0);
    SimpleNode[] exprch = {new ASTEmptyExpression(0),new ASTEmptyExpression(0),call};
    expr.setChildren(exprch);
    SimpleNode stmt = new ASTStatement(0);
    SimpleNode[] stmtch = {expr};
    stmt.setChildren(stmtch);
    SimpleNode[] mirchildren = new SimpleNode[3];
    mirchildren[0] = newIdentifier(name);
    mirchildren[1] = formalList; // sharing formals in the AST
    mirchildren[2] = new ASTStatementList(0);
    SimpleNode[] listch = {stmt};
    mirchildren[2].setChildren(listch);
    SimpleNode tramp = new ASTFunctionDeclaration(0);
    tramp.setChildren(mirchildren);
    SimpleNode f = new ASTModifiedDefinition(0);
    SimpleNode[] fch = {tramp};
    f.setChildren(fch);
    return f;
  }

  /**
   * Create a constructor for an interstitial class.
   * It has the same signature as the super and
   * calls super() with the right number of args.  If the super constructor
   * has optional arguments e.g. function MyClass(x, y = 3),
   * we'll declare signature the same and call super with the full set,
   * e.g. MyInterstitial(x, y = 3) { super(x,y); }
   * This works no matter how long the interstitial chain is.
   * @param newname name of new constructor
   * @param supernode AST of 'real' superclass to match args
   * @return AST for constructor
   */
  SimpleNode createInterstitialConstructor(String newname, SimpleNode supernode) {
    SimpleNode constructor = getConstructor(supernode);
    SimpleNode result;
    if (constructor == null) {
      // make default constructor
      result = buildTrampoline(newname, new ASTFormalParameterList(0), new SimpleNode[0]);
    }
    else {
      SimpleNode[] origparams = constructor.get(1).getChildren();

      // actual arguments for the super(arg1, arg2, ...) call
      List actuals = new ArrayList();
      for (int i=0; i<origparams.length; i++) {
        SimpleNode origparam = passThrough(origparams[i]);
        if (origparam instanceof ASTIdentifier) {
          ASTIdentifier id = (ASTIdentifier)origparam;

          if (id.getEllipsis()) {
            // Somewhat difficult to handle this case, and unknown
            // if it's worth the effort.
            throw new CompilerError(newname + ": cannot have variable args in constructor used as parent class of mixin");
          }
          actuals.add(newIdentifier(id.getName()));
        }
      }
      SimpleNode[] actualsArray = (SimpleNode[])actuals.toArray(new SimpleNode[0]);
      result = buildTrampoline(newname, constructor.get(1), actualsArray);
    }
    return result;
  }

  /**
   * Create an interstitial class.
   * @param mixin mixin that this interstitial implements
   * @param isname name for the interstitial
   * @param mixref the reference that caused this class to be created
   * @param supernode the 'real' superclass, or null if none
   * @return the new interstitial class AST
   */
  SimpleNode createInterstitial(SimpleNode mixin, String isname, MixinReference mixref, SimpleNode supernode)
  {
    // At this point, the mixin has already been visited.
    // We just need to grab its contents and make a fresh class
    // out of it, adding in a trampoline for the superclass constructor.
    //
    SimpleNode[] mixinchildren = mixin.getChildren();
    int origlen = mixinchildren.length;
    SimpleNode mixinconstructor = getConstructor(mixin);
    SimpleNode[] ischildren = new SimpleNode[origlen + (mixinconstructor == null ? 1 : 0)];
    SimpleNode isnode = new ASTClassDefinition(0);

    ischildren[0] = newIdentifier("class");
    ischildren[1] = newIdentifier(isname);
    ischildren[2] = newIdentifier(mixref.supername);

    // Before the tree is visited, child[3] has a list of
    // 'with'/'inherits' - that is, names of mixins.
    // After the tree has been visited, child[3] has an
    // identifier, which is the name of an interface,
    // something that the class 'implements'.
    // For an interstitial, that is the name of the mixin.

    ischildren[3] = newIdentifier(mixref.mixinname);
    System.arraycopy(mixinchildren, 4, ischildren, 4, origlen - 4);
    if (mixinconstructor == null) {
      if (supernode == null && mixref.realsuper != null) {

        // For an unknown superclass, we require the mixin programmer
        // to provide a constructor that handles all the cases it
        // might be used.  This is a temporary measure - we currently
        // have no knowledge of superclasses that live in other libraries.

        throw new CompilerError("Superclass " + mixref.realsuper + " used by mixin not defined, and no constructor supplied for mixin: " + mixref.mixinname);
      }
      ischildren[origlen] = createInterstitialConstructor(isname, supernode);
    }
    
    isnode.setChildren(ischildren);

    return isnode;
  }

  public String preProcess(String source) {
    if (!options.getBoolean(Compiler.BUILD_SHARED_LIBRARY)) {
      source += options.get(Compiler.SWF9_APPLICATION_PREAMBLE);
    }
    return source;
  }

  /**
   * Intercept JavascriptGenerator version, just to
   * track that we are within a function.
   */
  SimpleNode translateFunction(SimpleNode node, boolean isReferenced, SimpleNode[] children) {

    boolean savedInMethod = inMethod;
    inMethod = true;
    try {
      return super.translateFunction(node, isReferenced, children);
    }
    finally {
      inMethod = savedInMethod;
    }
  }

  /**
   * Override superclass version, we honor some passthrough properties.
   */
  public void checkPassthroughProperty(SimpleNode node, String key, Object value) {
      if (key.equals(PASSTHROUGH_TOPLEVEL)) {
        if (!(value instanceof Boolean)) {
          errPassthroughProperty(node, key, value, "Boolean value expected");
        }
      }
      else {
        errPassthroughProperty(node, key, value, "unknown key");
      }
  }

  /** Global variable seen by the generator.
   * Global definitions must go into their own output file.
   */
  public static class GlobalVariable {
    String name;
    String type;
    String initializer;
  }

  /** If a global has already been seen, make sure
   * that we don't have a conflict of initialization values.
   */
  private String checkGlobalValue(String valueName, String curval, String newval, String emsg) {
    if (curval != null && newval != null && !curval.equals(newval))
        throw new CompilerError(valueName + ": variable declared twice with " +
                                emsg + ": \"" +
                                curval + "\" and \"" + newval + "\"");
    if (curval != null)
      return curval;
    else
      return newval;
  }

  /**
   * Add this global variable to our private list.
   */
  void addGlobalVar(String name, String type, String initializer)
  {
    GlobalVariable glovar = (GlobalVariable)programVars.get(name);
    if (glovar == null) {
      glovar = new GlobalVariable();
      glovar.name = name;
      glovar.type = type;
      glovar.initializer = initializer;
      programVars.put(name, glovar);
    }
    else {
      glovar.type = checkGlobalValue(name, glovar.type, type, "different types");
      glovar.initializer = checkGlobalValue(name, glovar.initializer, initializer, "different initializers");
    }
  }

  /** Implements CodeGenerator.
   * Call the unparser to separate the program into translation units.
   */
  public List makeTranslationUnits(SimpleNode translatedNode, boolean compress, boolean obfuscate)
  {
    SWF9ParseTreePrinter.Config config = new SWF9ParseTreePrinter.Config();
    config.compress = compress;
    config.obfuscate = obfuscate;
    config.islib = options.getBoolean(Compiler.BUILD_SHARED_LIBRARY);
    config.trackLines = options.getBoolean(Compiler.TRACK_LINES);
    config.dumpLineAnnotationsFile = (String)options.get(Compiler.DUMP_LINE_ANNOTATIONS);
    config.forcePublicMembers = options.getBoolean(Compiler.DEBUG_SWF9) && !options.getBoolean(Compiler.DISABLE_PUBLIC_FOR_DEBUG);

    config.mainClassName = (String) options.get(Compiler.SWF9_APP_CLASSNAME);
    System.err.println("mainClassName = "+config.mainClassName);
    if (config.islib) {
      // 
    } else {
      config.trackLines = true;        // needed to get error messages that relate to original source
    }

    return (new SWF9ParseTreePrinter(config)).makeTranslationUnits(translatedNode, sources);
  }

  /** Implements CodeGenerator.
   * Push each TranslationUnit into a file and call the compiler.
   */
  public byte[] postProcess(List tunits)
  {
    boolean hasErrors = false;
    boolean buildSharedLibrary = options.getBoolean(Compiler.BUILD_SHARED_LIBRARY);
    SWF9External ex = new SWF9External(options);

    for (Iterator iter = tunits.iterator(); iter.hasNext(); ) {
      TranslationUnit tunit = (TranslationUnit)iter.next();

      String preamble = DEFAULT_FILE_PREAMBLE;
      String epilog = DEFAULT_FILE_EPILOG;

      ex.writeFile(tunit, preamble, epilog);
    }

    // For each global variable defined in programVars,
    // write it to its own translation unit.

    List glotunits = new ArrayList();
    for (Iterator variter = programVars.keySet().iterator(); variter.hasNext(); ) {
      String varname = (String)variter.next();
      GlobalVariable glovar = (GlobalVariable)programVars.get(varname);

      TranslationUnit tunit = new TranslationUnit();
      tunit.setName(varname);
      tunit.setIsClass(false);
      String decl = "public var " + varname;
      if (glovar.type != null)
        decl += ":" + glovar.type;
      if (glovar.initializer != null)
        decl += " = " + glovar.initializer;
      decl += ";";
      tunit.addText(decl);
      glotunits.add(tunit);
    }
    programVars = new HashMap();

    // Emit the global variable translation units, and
    // add them to the final list.

    for (Iterator iter = glotunits.iterator(); iter.hasNext(); ) {
      TranslationUnit tunit = (TranslationUnit)iter.next();
      ex.writeFile(tunit, DEFAULT_FILE_PREAMBLE, DEFAULT_FILE_EPILOG);
      tunits.add(tunit);
    }

    try {
      return ex.compileTranslationUnits(tunits, buildSharedLibrary);
    }
    catch (IOException ioe) {
      throw new CompilerError("Error running external compiler: " + ioe);
    }
  }
}

/**
 * @copyright Copyright 2006-2008 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */

