# File: CodeGenerator.py
# Author: Oliver Steele, P T Withington
# Description: JavaScript -> SWF bytecode compiler

# P_LZ_COPYRIGHT_BEGIN
#############################################################################
## Copyright (c) 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.       #
## Use is subject to license terms                                          #
#############################################################################
# P_LZ_COPYRIGHT_END


#
# Imports
#

from __future__ import nested_scopes
from types import *
False, True = 0, 1

#
# Utility functions
#

def nconc(*a):
    l = len(a)
    if l == 0:
        return a
    elif l == 1:
        return list(a[0])
    else:
        l = list(a[0])
        l.extend(a[1])
        return nconc(l, *a[2:])

import org.openlaszlo.sc.CompilerError as CompilerError
import org.openlaszlo.sc.SemanticError as SemanticError
import org.openlaszlo.sc.UnimplementedError as UnimplementedError
import org.openlaszlo.sc.CompilerImplementationError as CompilerImplementationError
import org.openlaszlo.sc.Compiler as Compiler
import org.openlaszlo.sc.VariableAnalyzer as VariableAnalyzer
import org.openlaszlo.sc.ReferenceCollector as ReferenceCollector
from parseinstructions import parseInstructions

def getSourceLocation(node):
    """ASTNode -> fname, lineno"""
    # Kranking requires unique names, so uniquify unknown with UID
    return node.filename or 'unknown file', node.lineNumber

#
# Code Generation
#

# The CodeGenerator recurses over the parse tree, sending instructions
# to an InstructionCollector.  The entry point is translate(), and it
# does its work by calling two mutually recursive functions,
# visitStatement and visitExpression, which dispatch to visitor
# functions for specific statement and expression types based on the
# name of the class of the parser node.  (A declaration or definition
# is considered to be a statement.)

import org.openlaszlo.sc.Values as Values
import org.openlaszlo.sc.Instructions as Instructions

# TODO [2004-03-09 ptw] Fix jython import * to import static members
NONE = Instructions.NONE
NextFrame = Instructions.NextFrame
PreviousFrame = Instructions.PreviousFrame
PLAY = Instructions.PLAY
STOP = Instructions.STOP
ToggleQuality = Instructions.ToggleQuality
StopSounds = Instructions.StopSounds
NumericAdd = Instructions.NumericAdd
SUBTRACT = Instructions.SUBTRACT
MULTIPLY = Instructions.MULTIPLY
DIVIDE = Instructions.DIVIDE
OldEquals = Instructions.OldEquals
OldLessThan = Instructions.OldLessThan
LogicalAnd = Instructions.LogicalAnd
LogicalOr = Instructions.LogicalOr
NOT = Instructions.NOT
StringEqual = Instructions.StringEqual
StringLength = Instructions.StringLength
SUBSTRING = Instructions.SUBSTRING
POP = Instructions.POP
INT = Instructions.INT
GetVariable = Instructions.GetVariable
SetVariable = Instructions.SetVariable
SetTargetExpression = Instructions.SetTargetExpression
StringConcat = Instructions.StringConcat
GetProperty = Instructions.GetProperty
SetProperty = Instructions.SetProperty
DuplicateMovieClip = Instructions.DuplicateMovieClip
RemoveClip = Instructions.RemoveClip
TRACE = Instructions.TRACE
StartDragMovie = Instructions.StartDragMovie
StopDragMovie = Instructions.StopDragMovie
StringLessThan = Instructions.StringLessThan
RANDOM = Instructions.RANDOM
MBLENGTH = Instructions.MBLENGTH
ORD = Instructions.ORD
CHR = Instructions.CHR
GetTimer = Instructions.GetTimer
MBSUBSTRING = Instructions.MBSUBSTRING
MBORD = Instructions.MBORD
MBCHR = Instructions.MBCHR
GotoFrame = Instructions.GotoFrame
GetUrl = Instructions.GetUrl
WaitForFrame = Instructions.WaitForFrame
SetTarget = Instructions.SetTarget
GotoLabel = Instructions.GotoLabel
WaitForFrameExpression = Instructions.WaitForFrameExpression
PUSH = Instructions.PUSH
BRANCH = Instructions.BRANCH
GetURL2 = Instructions.GetURL2
BranchIfTrue = Instructions.BranchIfTrue
CallFrame = Instructions.CallFrame
GotoExpression = Instructions.GotoExpression
DELETE = Instructions.DELETE
DELETE2 = Instructions.DELETE2
VarEquals = Instructions.VarEquals
CallFunction = Instructions.CallFunction
RETURN = Instructions.RETURN
MODULO = Instructions.MODULO
NEW = Instructions.NEW
VAR = Instructions.VAR
InitArray = Instructions.InitArray
InitObject = Instructions.InitObject
TypeOf = Instructions.TypeOf
TargetPath = Instructions.TargetPath
ENUMERATE = Instructions.ENUMERATE
ADD = Instructions.ADD
LessThan = Instructions.LessThan
EQUALS = Instructions.EQUALS
ObjectToNumber = Instructions.ObjectToNumber
ObjectToString = Instructions.ObjectToString
DUP = Instructions.DUP
SWAP = Instructions.SWAP
GetMember = Instructions.GetMember
SetMember = Instructions.SetMember
Increment = Instructions.Increment
Decrement = Instructions.Decrement
CallMethod = Instructions.CallMethod
NewMethod = Instructions.NewMethod
BitwiseAnd = Instructions.BitwiseAnd
BitwiseOr = Instructions.BitwiseOr
BitwiseXor = Instructions.BitwiseXor
ShiftLeft = Instructions.ShiftLeft
ShiftRight = Instructions.ShiftRight
UShiftRight = Instructions.UShiftRight
SetRegister = Instructions.SetRegister
CONSTANTS = Instructions.CONSTANTS
WITH = Instructions.WITH
DefineFunction = Instructions.DefineFunction
DefineFunction2 = Instructions.DefineFunction2
InstanceOf = Instructions.InstanceOf
EnumerateValue = Instructions.EnumerateValue
StrictEquals = Instructions.StrictEquals
GreaterThan = Instructions.GreaterThan
StringGreaterThan = Instructions.StringGreaterThan
BranchIfFalse = Instructions.BranchIfFalse
LABEL = Instructions.LABEL
COMMENT = Instructions.COMMENT
CHECKPOINT = Instructions.CHECKPOINT
BLOB = Instructions.BLOB

import org.openlaszlo.sc.Reference as Reference
import org.openlaszlo.sc.TranslationContext as TranslationContext
import org.openlaszlo.sc.VariableReference as VariableReference
import org.openlaszlo.sc.LiteralReference as LiteralReference
import org.openlaszlo.sc.PropertyReference as PropertyReference
import org.openlaszlo.sc.IndexReference as IndexReference

def meterFunctionEvent(translator, node, event, name):
    """Code to meter a function call.  If name is set, uses that,
    otherwise uses arguments.callee.name.  This code must be appended
    to the function prefix or suffix, as appropriate"""
    if name:
        getname = "'%s'" % name
    else:
        getname = 'arguments.callee.name'

    # Note _root.$lzprofiler can be undedefined to disable profiling
    # at run time.

    # N.B., According to the Javascript spec, getTime() returns
    # the time in milliseconds, but we have observed that the
    # Flash player on some platforms tries to be accurate to
    # microseconds (by including fractional milliseconds).  On
    # other platforms, the time is not even accurate to
    # milliseconds, hence the kludge to manually increment the
    # clock to create a monotonic ordering.

    # The choice of 0.01 to increment by is based on the
    # observation that when floats are used as member names in an
    # object they are coerced to strings with only 15 significant
    # digits.  This should suffice for the next (10^13)-1
    # microseconds (about 300 years).

    # TODO [2005-05016 ptw] (LPP-350) $flasm can clobber registers, so
    # we have to refresh then for each event
    code = "\
      { \
        \n#pragma 'warnUndefinedReferences=false'\n \
        var $lzsc$lzp = _root['$lzprofiler']; \
        if ($lzsc$lzp) { \
          var $lzsc$tick = $lzsc$lzp.tick; \
          var $lzsc$now = (new Date).getTime(); \
          while ($lzsc$tick == $lzsc$now) { \
            $lzsc$now += 0.01; \
          } \
          $lzsc$lzp.tick = $lzsc$now; \
          $lzsc$lzp.%s[$lzsc$now] = %s; \
        } \
      } \
      " % (event, getname)
    return list(Compiler.Parser().parse(code).children)

def checkUndefinedFunction(translator, node, reference):
    """Emits code to check that a function is defined.  If reference is
    set, expects the function reference to be at the top of the stack
    when called, otherwise expects the function object."""
    if translator.options.get(WARN_UNDEFINED_REFERENCES) and node.filename:
        t = translator
        fname, lineno = getSourceLocation(node)
        label = translator.newLabel(node)
        t.emit(DUP)                     # ref ref
        # Get the value of a function reference
        if reference:
            t.emit(GetVariable)         # ref val
        t.emit(DUP)                     # ref val val
        t.emit(TypeOf)                  # ref val type
        t.push("function")              # ref val type "function"
        t.emit(StringEqual)             # ref val type=="function"
        t.emit(BranchIfTrue(label))
        t.emitCall('$reportNotFunction', fname, lineno, reference, DUP)
        t.emit(LABEL(label))
        t.emit(POP)                     # pop error return or extra value

def checkUndefinedMethod(translator, node, methodName):
    """Emits code to check that an object method is defined.  Expects
    the object to be at the top of stack when called and does a trial
    GetMember on methodName to verify that it is a function.  Object
    is left on the stack."""
    if translator.options.get(WARN_UNDEFINED_REFERENCES) and node.filename:
        t = translator
        fname, lineno = getSourceLocation(node)
        # Check that object is not undefined
        isUndefined = t.newLabel(node)      # stack: object
        t.emit(DUP)                     # stack: object, object
        t.emit(TypeOf)                  # stack: object, TypeOf(object)
        t.push("undefined")             # stack object, TypeOf(object), 'undefined'
        t.emit(EQUALS)                  #  stack: object, TypeOf(object) == 'undefined'
        t.emit(BranchIfTrue(isUndefined)) # stack: object
        # Check that property is a function (i.e., it is a method)
        isMethod = t.newLabel(node)
        t.emit(DUP)                     # stack: object, object
        t.push(methodName)              # stack: object, object, method
        t.emit(GetMember)               # stack: object, object.method
        t.emit(DUP)                     # stack object, object.method, object.method
        t.emit(TypeOf)                  # stack object, object.method, TypeOf(object.method)
        t.push("function")              # stack object, object.method, TypeOf(object.method), 'function'
        t.emit(EQUALS)                  # stack object, object.method, TypeOf(object.method) == 'function'
        t.emit(BranchIfTrue(isMethod))  # stack object, object.method
        t.emitCall('$reportUndefinedMethod',
                   fname,
                   lineno,
                   methodName,
                   DUP)                 # stack: object, None
        t.emit(BRANCH(isMethod))
        t.emit(LABEL(isUndefined))      # stack: object
        t.emitCall('$reportUndefinedObjectProperty',
                   fname,
                   lineno,
                   methodName)          # stack: object, None
        t.emit(LABEL(isMethod))
        t.emit(POP)                     # stack: object


# The code generator dispatches a node whose class is named ASTName to
# a method visitName, passing the node, a context, and the node's
# children as arguments.  The context for a statement visitor is a
# TranslationContext, defined above.  The context for an expression
# visitor is a boolean value, that is true iff the value of the
# expression is used.  The return value of a statement visitor is
# ignored.  The return value of an expression visitor is true iff it
# generated code that did NOT leave a value on the stack.  (This is so
# that an expression visitor that ignores its context need do nothing
# special to indicate that it ignored it: the default return value of
# None signals this.)
#
# Methods of the form visitName are AST node visitors, and follow the
# protocol described above.  Methods of the form translateName are
# helper functions for the visitors, and have arbitrary parameter
# lists and return values.

import org.openlaszlo.sc.parser.ParseException as ParseException
import org.openlaszlo.sc.parser.ParserConstants as Ops

XfixInstrs = {Ops.INCR: Increment,
              Ops.DECR: Decrement}

UnopInstrs = {Ops.PLUS: [],
              Ops.MINUS: [PUSH(-1), MULTIPLY],
              Ops.BANG: [NOT],
              Ops.TILDE: [PUSH(-1), BitwiseXor],
              Ops.TYPEOF: [TypeOf],
              Ops.VOID: [POP, (PUSH(Values.Undefined))],
              }

# Binop translation for swf6.  visitBinaryExpression handles swf5
# exceptions.
BinopInstrs = {Ops.PLUS: [ADD],
               Ops.MINUS: [SUBTRACT],
               Ops.STAR: [MULTIPLY],
               Ops.SLASH: [DIVIDE],
               Ops.REM: [MODULO],
               Ops.BIT_AND: [BitwiseAnd],
               Ops.BIT_OR: [BitwiseOr],
               Ops.XOR: [BitwiseXor],
               Ops.LSHIFT: [ShiftLeft],
               Ops.RSIGNEDSHIFT: [ShiftRight],
               Ops.RUNSIGNEDSHIFT: [UShiftRight],
               # swf6 returns undefined for comparisons with NaN, it
               # is supposed to return false (note that you cannot
               # eliminate one NOT by inverting the sense of the
               # comparison
               Ops.LT: [LessThan, NOT, NOT],
               Ops.GT: [GreaterThan, NOT, NOT],
               # swf6 does not have GE or LE, but inverting the
               # complement operator does not work for NaN ordering
               # Luckily, LogicalOr coerces undefined to false, so we
               # don't have to play the NOT NOT trick above
               Ops.LE: [SetRegister(0), # a b
                        POP,            # a
                        DUP,            # a a
                        PUSH(Values.Register(0)), # a a b
                        EQUALS,         # a a==b
                        SWAP,           # a==b a
                        PUSH(Values.Register(0)), # a==b a b
                        LessThan,       # a==b a<b
                        LogicalOr       # a==b||a<b
                        ],
               Ops.GE: [SetRegister(0), # a b
                        POP,            # a
                        DUP,            # a a
                        PUSH(Values.Register(0)), # a a b
                        EQUALS,         # a a==b
                        SWAP,           # a==b a
                        PUSH(Values.Register(0)), # a==b a b
                        GreaterThan,    # a==b a>b
                        LogicalOr       # a==b||a>b
                        ],
               Ops.EQ: [EQUALS],
               Ops.SEQ: [StrictEquals],
               # swf6 does not have NE or SNE either, but inverting
               # the complement is correct for NaN
               Ops.NE: [EQUALS, NOT],
               Ops.SNE: [StrictEquals, NOT],
               Ops.INSTANCEOF: [InstanceOf]
               }

AssignOpTable = {Ops.PLUSASSIGN: Ops.PLUS,
                 Ops.MINUSASSIGN: Ops.MINUS,
                 Ops.STARASSIGN: Ops.STAR,
                 Ops.SLASHASSIGN: Ops.SLASH,
                 Ops.ANDASSIGN: Ops.BIT_AND,
                 Ops.ORASSIGN: Ops.BIT_OR,
                 Ops.XORASSIGN: Ops.XOR,
                 Ops.REMASSIGN: Ops.REM,
                 Ops.LSHIFTASSIGN: Ops.LSHIFT,
                 Ops.RSIGNEDSHIFTASSIGN: Ops.RSIGNEDSHIFT,
                 Ops.RUNSIGNEDSHIFTASSIGN: Ops.RUNSIGNEDSHIFT,
                 }

import org.openlaszlo.sc.InstructionCollector as InstructionCollector

# Replace instruction subsequences by a BLOB instruction that
# represents the same bytes.  By default, the BLOB instructions are
# separated by PUSH's (which depend on the constant pool), and
# branches and targets (since they can't be resolved until the size of
# the PUSH instructions is known).  When noConstantPool=True, PUSH's
# are compiled against a null constant pool, and branches and targets
# are compiled, so the instructions combine to a single BLOB.
import java.nio.ByteBuffer as ByteBuffer
def combineInstructions(instrsIn, noConstantPool=False):
    instrsOut = []
    buffer = ByteBuffer.allocate(64000)
    def flush(instrsOut=instrsOut,buffer=buffer):
        if buffer.position():
            import jarray
            bytes = jarray.zeros(buffer.position(), 'b')
            buffer.flip()
            buffer.get(bytes)
            buffer.clear()
            instrsOut.append(BLOB('bytes', bytes))
    for instr in instrsIn:
        if noConstantPool or instr.isPush or instr.isLabel or instr.hasTarget:
            flush();
            instrsOut.append(instr)
        else:
            instr.writeBytes(buffer, None)
    flush()
    return instrsOut

# Each entry has three parts:
# - a key, used to store and retrieve it
# - a checksum, which tells whether the value is current
# - a value
import org.openlaszlo.cache.PersistentMap as PersistentMap
class ScriptCompilerCache:
    def __init__(self, useDisk=False):
        self.cache = {}
        self.useDisk = useDisk
        if useDisk:
            from java.util import Properties
            from java.io import File
            import os
            cacheFileName = os.path.join(os.getenv('LPS_HOME'), 'WEB-INF/lps/lfc/build/cache', useDisk)
            self.cache = PersistentMap(
                'buildlfc' + useDisk, File(cacheFileName), Properties())

    def getItem(self, key, checksum):
        entry = self.cache.get(key)
        if entry and entry[0] == checksum:
            return entry[1]
        #if entry and entry[0] != checksum:
        #    print 'checksum failed', entry[0], checksum

    def setItem(self, key, checksum, value):
        if not self.useDisk:
            self.cache[key] = (checksum, value)
            return
        from java.util import Vector
        v = Vector()
        v.add(checksum)
        v.add(value)
        self.cache.put(key, v)

#
# Compiler Options
#

# TODO [2004-03-11 ptw] share with CompilationEnvironment.java
ACTIVATION_OBJECT = 'createActivationObject'
COMPUTE_METAREFERENCES = 'computeMetaReferences'
CONDITIONAL_COMPILATION = 'conditionalCompilation'
ALLOW_ROOT = 'allowRoot'
CACHE_COMPILES = 'cacheCompiles'
COMPILE_TRACE = 'compileTrace'
COMPILE_TIME_CONSTANTS = 'compileTimeConstants'
CONSTRAINT_FUNCTION = 'constraintFunction'
DEBUG = 'debug'
DEBUG_BACKTRACE = 'debugBacktrace'
DISABLE_CONSTANT_POOL = 'disableConstantPool'
ELIMINATE_DEAD_EXPRESSIONS = 'eliminateDeadExpressions'
FLASH_COMPILER_COMPATABILITY = 'flashCompilerCompatability'
GENERATE_FUNCTION_2 = 'generateFunction2'
GENERATE_FUNCTION_2_FOR_LZX = 'generateFunction2ForLZX'
INCLUDES = 'processIncludes'
INSTR_STATS = 'instrStats'
KRANK = 'krank'
RUNTIME = 'runtime'
METHOD_NAME = 'methodName'
NAME_FUNCTIONS = 'nameFunctions'
OBFUSCATE = 'obfuscate'
PROFILE = 'profile'
PROFILE_COMPILER = 'profileCompiler'
PROGRESS = 'progress'
PRINT_COMPILER_OPTIONS = 'printCompilerOptions'
PRINT_CONSTRAINTS = 'printConstraints'
PRINT_INSTRUCTIONS = 'printInstructions'
RESOLVER = 'resolver'
SCRIPT_ELEMENT = 'scriptElement'
VALIDATE_CACHES = 'validateCaches'
WARN_UNDEFINED_REFERENCES = 'warnUndefinedReferences'
WARN_GLOBAL_ASSIGNMENTS = 'warnGlobalAssignments'
WARN_UNUSED_LOCALS = 'warnUnusedLocals'
WARN_UNUSED_PARAMETERS = 'warnUnusedParameters'
WITH_THIS = 'withThis'

# Options that don't affect code generation.  This is used to decide
# what it's okay to cache across LFC build versions.  It's okay if
# it's too small.
NonCodeGenerationOptions = [
    CACHE_COMPILES,PROFILE_COMPILER,INSTR_STATS,
    PROFILE_COMPILER,
    PROGRESS,PRINT_COMPILER_OPTIONS,PRINT_CONSTRAINTS,PROGRESS,
    RESOLVER,
    # These affect the default settings for the options above, but
    # do not themselves make a difference.
    DEBUG,KRANK]

# jythonc has special support for 'import...as'.  It's necessary to use
# it for importing classes from the same JAR that this file is compiled
# into.
import org.openlaszlo.sc.parser.ASTAndExpressionSequence as AndExpressionSequence
import org.openlaszlo.sc.parser.ASTArrayLiteral as ArrayLiteral
import org.openlaszlo.sc.parser.ASTAssignmentExpression as AssignmentExpression
import org.openlaszlo.sc.parser.ASTBinaryExpressionSequence as BinaryExpressionSequence
import org.openlaszlo.sc.parser.ASTBreakStatement as BreakStatement
import org.openlaszlo.sc.parser.ASTCallExpression as CallExpression
import org.openlaszlo.sc.parser.ASTCaseClause as CaseClause
import org.openlaszlo.sc.parser.ASTClassDefinition as ClassDefinition
import org.openlaszlo.sc.parser.ASTConditionalExpression as ConditionalExpression
import org.openlaszlo.sc.parser.ASTContinueStatement as ContinueStatement
import org.openlaszlo.sc.parser.ASTDefaultClause as DefaultClause
import org.openlaszlo.sc.parser.ASTDirectiveBlock as DirectiveBlock
import org.openlaszlo.sc.parser.ASTDoWhileStatement as DoWhileStatement
import org.openlaszlo.sc.parser.ASTEmptyExpression as EmptyExpression
import org.openlaszlo.sc.parser.ASTExpressionList as ExpressionList
import org.openlaszlo.sc.parser.ASTExtends as Extends
import org.openlaszlo.sc.parser.ASTForInStatement as ForInStatement
import org.openlaszlo.sc.parser.ASTForStatement as ForStatement
import org.openlaszlo.sc.parser.ASTForVarInStatement as ForVarInStatement
import org.openlaszlo.sc.parser.ASTForVarStatement as ForVarStatement
import org.openlaszlo.sc.parser.ASTFormalParameterList as FormalParameterList
import org.openlaszlo.sc.parser.ASTFunctionCallParameters as FunctionCallParameters
import org.openlaszlo.sc.parser.ASTFunctionDeclaration as FunctionDeclaration
import org.openlaszlo.sc.parser.ASTFunctionExpression as FunctionExpression
import org.openlaszlo.sc.parser.ASTIdentifier as Identifier
import org.openlaszlo.sc.parser.ASTIfDirective as IfDirective
import org.openlaszlo.sc.parser.ASTIfStatement as IfStatement
import org.openlaszlo.sc.parser.ASTIncludeDirective as IncludeDirective
import org.openlaszlo.sc.parser.ASTLabeledStatement as LabeledStatement
import org.openlaszlo.sc.parser.ASTLiteral as Literal
import org.openlaszlo.sc.parser.ASTNewExpression as NewExpression
import org.openlaszlo.sc.parser.ASTObjectLiteral as ObjectLiteral
import org.openlaszlo.sc.parser.ASTOperator as Operator
import org.openlaszlo.sc.parser.ASTOrExpressionSequence as OrExpressionSequence
import org.openlaszlo.sc.parser.ASTPostfixExpression as PostfixExpression
import org.openlaszlo.sc.parser.ASTPragmaDirective as PragmaDirective
import org.openlaszlo.sc.parser.ASTProgram as Program
import org.openlaszlo.sc.parser.ASTPropertyIdentifierReference as PropertyIdentifierReference
import org.openlaszlo.sc.parser.ASTPropertyValueReference as PropertyValueReference
import org.openlaszlo.sc.parser.ASTReturnStatement as ReturnStatement
import org.openlaszlo.sc.parser.ASTStatement as Statement
import org.openlaszlo.sc.parser.ASTStatementList as StatementList
import org.openlaszlo.sc.parser.ASTSuperCallExpression as SuperCallExpression
import org.openlaszlo.sc.parser.ASTSwitchStatement as SwitchStatement
import org.openlaszlo.sc.parser.ASTThisReference as ThisReference
import org.openlaszlo.sc.parser.ASTThrowStatement as ThrowStatement
import org.openlaszlo.sc.parser.ASTTryStatement as TryStatement
import org.openlaszlo.sc.parser.ASTUnaryExpression as UnaryExpression
import org.openlaszlo.sc.parser.ASTVariableDeclaration as VariableDeclaration
import org.openlaszlo.sc.parser.ASTVariableStatement as VariableStatement
import org.openlaszlo.sc.parser.ASTWhileStatement as WhileStatement
import org.openlaszlo.sc.parser.ASTWithStatement as WithStatement

import java.lang.Object
import org.openlaszlo.sc.Translator as Translator

class CodeGenerator(java.lang.Object):
    def getOptions(self):
        "@sig public java.util.Map getOptions()"
        return self.options

    def getContext(self):
        "@sig public java.lang.Object getContext()"
        return self.context

    def setOptions(self, options):
        "@sig public void setOptions(java.util.Map options)"
        self.options = options
        self.collector = InstructionCollector(not not self.options.get(DISABLE_CONSTANT_POOL), True)
        self.emit = self.collector.emit
        self.push = self.collector.push
        runtime = self.options.get(RUNTIME)
        assert runtime in ("swf6", "swf7", "swf8"), 'uknown runtime %r' % runtime
        Instructions.setRuntime(runtime)

    def translate(self, program):
        "@sig public void translate(java.lang.Object program)"
        self.translateInternal(program)

    def getCollector(self):
        "@sig public java.lang.Object getCollector()"
        return self.collector

    def newLabel(self, node):
        "@sig   public java.lang.String newLabel(java.lang.Object node)"
        return self.collector.newLabel('%s:%s' % getSourceLocation(node))

    # class Visitor(java.lang.Object):
    def getVisitor(self, node):
        # trim the module name, and the initial 'AST'
        if node.class is Identifier:
            name = 'Identifier'
        else:
            name = node.class.name
            name = name[name.rfind('.')+4:]
        return getattr(self, 'visit' + name, None)

    # Only used by warning generator, hence not metered.
    def emitCall(self, name, *args):
        args = list(args)
        args.reverse()
        for arg in args:
            if type(arg) == IntType:
                self.push(arg)
            elif type(arg) == StringType:
                self.push(arg)
            elif type(arg) == TupleType:
                self.push(*arg)
            elif arg is DUP:
                pass
            else:
                raise "unknown type for %r" % arg
        self.push(len(args))
        self.push(name)
        self.emit(CallFunction)

    def translateInternal(self, program, cpass='b', top=True):
        nodeType = program.class
        assert nodeType == Program
        self.context = TranslationContext(Program, None)
        self.visitProgram(program, program.children, cpass, top)

    def showStats(self, node=None):
        if not self.options.get(INSTR_STATS): return
        prev = getattr(self, 'previousStatLoc', None)
        if node:
            loc = node.filename, node.lineNumber
        elif prev:
            loc = prev[0], prev[1]+1
        else:
            return
        if loc == prev: return
        self.emit(CHECKPOINT('%s:%d:' % loc))
        self.previousStatLoc = loc

    def evaluateCompileTimeConditional(self, node):
        if node.class is Identifier:
            name = node.name
            constants = self.options.get(COMPILE_TIME_CONSTANTS, {})
            return constants.get(name)

    def visitProgram(self, node, directives, cpass, top=False):
        # cpass is 'b'oth, 1, or 2
        if cpass == 'b':
            self.visitProgram(node, directives, 1, top)
            self.visitProgram(node, directives, 2, top)
            return
        if cpass == 1 and top:
            # emit compile-time contants to runtime
            opts = self.options.get(COMPILE_TIME_CONSTANTS, {})
            for name in opts.keySet():
                self.push(name)
                self.push(opts[name])
                self.emit(VarEquals)
        index = 0
        while index < len(directives):
            node = directives[index]
            index += 1
            children = node.children
            if node.class is DirectiveBlock:
                savedOptions = self.options
                try:
                    self.options = self.options.copy()
                    self.visitProgram(node, node.children, cpass)
                finally:
                    self.options = savedOptions
                continue
            elif node.class is IfDirective:
                if not self.options.get(CONDITIONAL_COMPILATION):
                    # TBD: different type; change to CONDITIONALS
                    raise CompilerError("'if' at top level")
                value = self.evaluateCompileTimeConditional(node[0])
                if value is None:
                    raise CompilerError("undefined compile-time conditional %s" % Compiler.nodeString(node[0]))
                if value:
                    #print node, node.children[:]
                    self.visitProgram(node, node[1].children, cpass)
                elif len(node) > 2:
                    self.visitProgram(node, node[2].children, cpass)
                continue
            elif node.class is IncludeDirective:
                # Disabled by default, since it isn't supported in the
                # product.  (It doesn't go through the compilation
                # manager for dependency tracking.)
                if not self.options.get(INCLUDES):
                    raise UnimplementedError("unimplemented: #include", node)
                userfname = node[0].value
                self.compileInclude(userfname, cpass)
                continue
            elif node.class is PragmaDirective:
                self.visitPragmaDirective(node, *node.children)
                continue

            if cpass == 1:
                # Function, class, and top-level expressions are processed in pass 1
                if node.class is FunctionDeclaration:
                    self.visitStatement(node)
                elif node.class is ClassDefinition:
                    self.visitClassDefinition(node, *node.children)
                elif node.class is Statement:
                    # Statements are processed in pass 2
                    pass
                else:
                    self.visitExpression(node, False)
            if cpass == 2:
                # Statements are processed in pass 2
                if node.class is Statement:
                    newIndex = compileAssignments(self, directives, index-1, self.options.get(OBFUSCATE))
                    #newIndex = False
                    if newIndex:
                        index = newIndex
                    else:
                        self.visitStatement(node)
        self.showStats()

    def getCodeGenerationOptionsKey(self, ignore=[]):
        def mapToString(map):
            items = map.items()
            items.sort()
            return '{' + ', '.join(['%r: %r' % item
                                    for item in items]) + '}'
        options = {}
        # Doesn't work for a Java Map
        # options.update(self.options)
        for key in self.options.keySet():
            options[key] = self.options[key]
        for key in NonCodeGenerationOptions+ignore:
            if options.has_key(key):
                del options[key]
        for key, value in options.items():
            if type(value) == type({}):
                options[key] = mapToString(value)
        return mapToString(options)
    
    def parseFile(self, fname, userfname, source):
        if not Compiler.CachedParses:
            Compiler.CachedParses = ScriptCompilerCache()
        sourceKey = fname
        sourceChecksum = source
        entry = Compiler.CachedParses.getItem(sourceKey, sourceChecksum)
        if not entry or self.options.get(VALIDATE_CACHES):
            if self.options.get(PROGRESS):
                # Even though code generation is re-run
                # for every file, just print this for
                # files that are re-parsed, to indicate
                # what's being changed.
                print 'Compiling %s...' % userfname
            import re
            hasIncludes = False
            for line in source.split('\n'):
                if re.match(r'\s*#\s*include\s*"', line):
                    hasIncludes = True
                    break
            program = Compiler.Parser().parse(source)
            # Always cache the parse tree, since this
            # helps even when the compilation is only one
            # once.  This is because each pass processes
            # the #include again.
            realentry = program, hasIncludes
            Compiler.CachedParses.setItem(sourceKey, sourceChecksum, realentry)
            if self.options.get(VALIDATE_CACHES):
                if entry and (['%r' % item for item in entry] != ['%r' % item for item in realentry]):
                    print "Bad parse cache for %s: %r != %r" % (sourceKey, entry, realentry)
            entry = realentry
        return entry
    
    def compileInclude(self, userfname, cpass):
        if not Compiler.CachedInstructions:
            Compiler.CachedInstructions = ScriptCompilerCache()
        fname = userfname
        if self.options.get('resolver'):
            fname = self.options['resolver'].resolve(fname)
        f = open(fname)
        try:
            source = ('#file "%s"\n#line 1\n' % userfname) + f.read()
        finally:
            f.close()
        try:
            optionsKey = self.getCodeGenerationOptionsKey([
                # The constant pool isn't cached, so it doesn't affect code
                # generation so far as the cache is concerned.
                DISABLE_CONSTANT_POOL])
            # If these could be omitted from the key for files that didn't
            # reference them, then the cache could be shared between krank
            # and krank debug.  (The other builds differ either on OBFUSCATE,
            # RUNTIME, NAMEFUNCTIONS, or PROFILE, so there isn't any other
            # possible sharing.)
            instrsKey = fname, optionsKey, cpass
            #from java.security import MessageDigest
            #md = MessageDigest.getInstance('MD5')
            #md.update(source)
            #instrsChecksum = md.digest()
            instrsChecksum = source
            instrs = self.options.get(CACHE_COMPILES) and \
                     Compiler.CachedInstructions.getItem(instrsKey, instrsChecksum)
            if instrs and instrs is not None and not self.options.get(VALIDATE_CACHES):
                self.collector.appendInstructions(instrs)
            else:
                program, hasIncludes = self.parseFile(fname, userfname, source)
                startpos = self.collector.size()
                self.translateInternal(program, cpass, False)
                if not hasIncludes: # and self.collector.size() != startpos:
                    # and not :
                    assert not self.collector.constantsGenerated
                    realinstrs = self.collector.subList(startpos, self.collector.size())
                    realinstrs = list(realinstrs)
                    if self.options.get(VALIDATE_CACHES):
                        if instrs and (instrs is not None) and (['%r' % item for item in instrs] != ['%r' % item for item in realinstrs]):
                            print "Bad instr cache for %s (%r != %r)" % (fname, instrs, realinstrs)
                    # The following line only speeds up buildlfc when
                    # noConstantPool=True, which produces vastly
                    # larger binaries.
                    #instrs = combineInstructions(instrs, True)
                    if self.options.get(CACHE_COMPILES):
                        Compiler.CachedInstructions.setItem(
                            instrsKey, instrsChecksum, realinstrs)
        except ParseException, e:
            import sys
            print >> sys.stderr, "while compiling " + fname
            raise

    def visitPragmaDirective(self, node, value):
        key, value = value.value, True
        if '=' in key:
            key, value = key.split('=', 1)
        if value in ('false', 'true'):
            value = value == 'true'
        self.options[key] = value

    def visitClassDefinition(self, node, classname, super, *defs):
        # Flatten nested StatementList structures
        def flatten(src):
            dst = []
            for node in src:
                if node.class is StatementList:
                    dst += flatten(node.children)
                else:
                    dst.append(node)
            return dst
        defs = flatten(defs)
        # Separate the defs into constructors, instance variable
        # declarations, and methods
        ctors = []
        instancevars = []
        methods = []
        for node in defs:
            if node.class is FunctionDeclaration:
                if node[0].name == classname.name:
                    ctors.append(node)
                else:
                    methods.append(node)
            elif node.class is VariableDeclaration:
                # make sure there's an initializer, for ease of
                # downstream processing
                if len(node) == 1:
                    node.jjtAddChild(EmptyExpression(0), len(node.children))
                instancevars.append(node)
            else:
                # TODO: [2002 ows] move this error into the parser,
                # once the spec has settled
                raise UnimplementedError("unimplemented class block directive", node)
        # Get a constructor, to attach the other definitions to.
        if len(ctors) > 1:
            raise UnimplementedError("duplicate constructors for %s" %
                                     classname, node)
        if ctors:
            ctor = ctors[0]
        else:
            ctor = Compiler.Parser().build(FunctionDeclaration(0), classname, \
                                  (FormalParameterList(0),), \
                                  (StatementList(0),))
        self.visitStatement(ctor)
        # If it's a subclass, extend the superclass
        if super.class is Identifier:
            stmt = Compiler.Parser().parse("Object.class.extends(%s, %s)" %
                                  (super.name, classname.name))[0][0]
            self.visitStatement(stmt)
        # Add the instance variable definitions
        assign = Operator(0)
        assign.operator = Ops.ASSIGN
        def makePrototype():
            return Compiler.Parser().build(PropertyIdentifierReference(0), classname,
                                  Identifier('prototype'))
        for node in instancevars:
            var, init = node.children
            n = Compiler.Parser().build(
                AssignmentExpression(0),
                (PropertyIdentifierReference(0), makePrototype(), var),
                assign,
                init)
            self.visitStatement(n)
        # Add the member functions
        for node in methods:
            if node.class is FunctionDeclaration:
                n = Compiler.Parser().build(
                    AssignmentExpression(0),
                    (PropertyIdentifierReference(0), makePrototype(), node[0]),
                    assign,
                    (FunctionExpression(0),) + tuple(node.children[1:]))
                #n = Compiler.Parser().substitute('_0.prototype._1 = function (_3) {_4}',
                #                        _0=Identifier(classname),
                #                        _1=node[1],
                #                        _2=Compiler.Splice(node[2].children),
                #                        _3=Compiler.Splice(node[3].children))
                self.visitStatement(n)

    # This will only work in the jython interpreter, not from the jar,
    # because this style of import is broken for jythonc code running
    # in a jar.
    def testStaticCoverage(self):
        """Check that a visitor exists for each node type."""
        missingFunctions = []
        # These are handled specially, within other visitors
        unnecessaryVisitors = ['visit' + s for s in 'CaseClause DefaultClause FormalParameterList FunctionCallParameters Identifier Literal Operator Program'.split()]
        import org.openlaszlo.sc.parser
        for name in dir(org.openlaszlo.sc.parser):
            if name.startswith('AST'):
                fnname = 'visit' + name[3:]
                if not getattr(self, fnname, None) and \
                       fnname not in unnecessaryVisitors:
                    missingFunctions.append(fnname)
        assert not missingFunctions, \
               "Missing the following visitor functions: " + `missingFunctions`

    def visitStatementList(self, node, *stmts):
        i = 0
        inFlasm = self.context.getProperty(self.context.FLASM)
        newContext = self.context.clone()
        newContext.setProperty(newContext.FLASM, False)
        prevContext = self.context
        # ensure dynamic extent of #pragma in a block
        prevOptions = self.options
        newOptions = self.options.copy()
        # TODO: [2003-04-15 ptw] bind context slot macro
        try:
            self.context = newContext
            self.options = newOptions
            while i < len(stmts):
                stmt = stmts[i]
                if stmt.children:
                    node = stmt[0]
                    nt = node.class
                    newIndex = None
                    if nt is AssignmentExpression:
                        newIndex = compileAssignments(self, stmts, i)
                    elif nt is Identifier and node.name == "$flasm" and \
                             self.options.get(FLASH_COMPILER_COMPATABILITY):
                        newIndex = self.compileInlineAssembly(stmts, i)
                    elif nt is Literal and type(node.value) is StringType and \
                             inFlasm:
                        instructions = parseInstructions(node.value)
                        if self.options.get(PROFILE) or self.options.get(DEBUG_BACKTRACE):
                            def profiled_emit(instr):
                                if instr is RETURN:
                                    self.emit(BRANCH(self.context.findFunctionContext().label))
                                else:
                                    self.emit(instr)
                            map(profiled_emit, instructions)
                        else:
                            for instr in instructions:
                                self.emit(instr)
                        newIndex = i+1
                    if newIndex:
                        i = newIndex
                        continue
                self.visitStatement(stmts[i])
                i += 1
        finally:
            self.context = prevContext
            self.options = prevOptions

    # for function prefix/suffix parsing
    visitDirectiveBlock = visitStatementList
    
    def visitFunctionDeclaration(self, node, *ast):
        # Inner functions are handled by translateFunction
        if self.context.type == Program:
            savedOptions = self.options
            try:
                self.options = self.options.copy()
                self.options[CONSTRAINT_FUNCTION] = False
                # Make sure all our top-level functions have root context
                if True:
                    block = self.newLabel(node)
                    self.push('_root')
                    self.emit(GetVariable)
                    self.emit(WITH(block))
                self.translateFunction(node, True, *ast)
                if True:
                    self.emit(LABEL(block))
            finally:
                self.options = savedOptions

    #
    # Statements
    #

    def visitStatement(self, node):
        """This function, unlike the other statement visitors, can be
        applied to any statement node, so it dispatches based on the
        node's class.""" #' <- make emacs happy
        assert self.context.__class__ == TranslationContext
        children = node.children
        self.showStats(node)
        fn = self.getVisitor(node)
        assert fn, "missing visitor for %r" % node
        # if it's an expression, unset fn so that we fall through
        # to the visitExpression case
        name = fn.__name__
        if self.isExpressionType(name):
            fn = None
        if fn == self.visitStatement:
            # an empty statement, introduced by an extra ';', has no children
            if children:
                fn(children[0])
        elif fn:
            fn(node, *children)
        else:
            self.visitExpression(node, False)

    def visitLabeledStatement(self, node, name, stmt):
        # TODO: [2003-04-15 ptw] bind context slot macro
        try:
            self.context = TranslationContext(LabeledStatement, self.context, name.name)
            # TODO: [2002 ows] throw semantic error for duplicate label
            self.visitStatement(stmt)
        finally:
            self.context = self.context.parent

    def visitVariableDeclaration(self, node, id, initValue=None):
        if initValue:
            ref = self.translateReference(id).preset()
            self.visitExpression(initValue)
            ref.init()
        elif self.context.type == Program:
            # In a function, variable declarations will already be done
            ref = self.translateReference(id).preset()
            ref.declare()

    def visitVariableStatement(self, node, *children):
        for child in children:
            self.visitStatement(child)

    def visitIfStatement(self, node, test, a, b=None):
        if test.class is Identifier and test.name == "$flasm" and \
           self.options.get(FLASH_COMPILER_COMPATABILITY):
            prevContext = self.context
            newContext = self.context.clone()
            # TODO: [2003-04-15 ptw] bind context slot macro
            try:
                if not False: #self.options.get(RUNTIME) == "swf7":
                    newContext.setProperty(self.context.FLASM, True)
                    self.context = newContext
                    assert a.class is Statement and a[0].class is StatementList
                    self.visitStatementList(a[0], *a[0].children)
                else:
                    newContext.setProperty(self.context.FLASM, False)
                    self.context = newContext
                    assert b.class is Statement and b[0].class is StatementList
                    self.visitStatementList(b[0], *b[0].children)
            finally:
                self.context = prevContext
            return
        value = self.evaluateCompileTimeConditional(test)
        if value is not None:
            if value:
                self.visitStatement(a)
            elif b:
                self.visitStatement(b)
        elif b:
            self.translateControlStructure(
                node,
                [('expr', test),
                 BranchIfFalse(0),
                 ('stmt', a),
                 BRANCH(1),
                 0,
                 ('stmt', b),
                 1])
        else:
            self.translateControlStructure(
                node,
                [('expr', test),
                 BranchIfFalse(0),
                 ('stmt', a),
                 0])

    # for function prefix/suffix parsing
    visitIfDirective = visitIfStatement

    def visitWhileStatement(self, node, test, body):
        # TODO: [2003-04-15 ptw] bind context slot macro
        try:
            self.context = TranslationContext(WhileStatement, self.context)
            continueLabel = self.newLabel(node)
            breakLabel = self.newLabel(node)
            self.context.setTarget('break', breakLabel)
            self.context.setTarget('continue', continueLabel)
            self.translateControlStructure(
                node,
                [LABEL(continueLabel),
                 ('expr', test),
                 BranchIfFalse(breakLabel),
                 ('stmt', body),
                 BRANCH(continueLabel),
                 LABEL(breakLabel)])
        finally:
            self.context = self.context.parent

    def visitDoWhileStatement(self, node, body, test):
        # TODO: [2003-04-15 ptw] bind context slot macro
        try:
            self.context = TranslationContext(DoWhileStatement, self.context)
            continueLabel = self.newLabel(node)
            breakLabel = self.newLabel(node)
            self.context.setTarget('break', breakLabel)
            self.context.setTarget('continue', continueLabel)
            self.translateControlStructure(
                node,
                [LABEL(continueLabel),
                 ('stmt', body),
                 ('expr', test),
                 BranchIfTrue(continueLabel),
                 LABEL(breakLabel)])
        finally:
            self.context = self.context.parent

    def visitForStatement(self, node, init, test, step, body):
        self.translateForStatement(node, init, test, step, body)

    def visitForVarStatement(self, node, init, test, step, body):
        self.translateForStatement(node, init, test, step, body)

    def translateForStatement(self, node, init, test, step, body):
        # TODO: [2003-04-15 ptw] bind context slot macro
        savedOptions = self.options
        try:
            self.options = self.options.copy()
            self.context = TranslationContext(ForStatement, self.context)
            if self.options.get(OBFUSCATE):
                # an arbitrarily different (and less efficient) block order,
                # to confuse decompilers
                enterLabel = self.newLabel(node)
                testLabel = self.newLabel(node)
                topLabel = self.newLabel(node)
                continueLabel = self.newLabel(node)
                breakLabel = self.newLabel(node)
                self.context.setTarget('break', breakLabel)
                self.context.setTarget('continue', continueLabel)
                self.translateControlStructure(
                    node,
                    [BRANCH(enterLabel),
                     LABEL(topLabel),
                     ('stmt', body),
                     LABEL(continueLabel),
                     ('stmt', step),
                     BRANCH(testLabel),
                     LABEL(enterLabel)])
                self.options[WARN_GLOBAL_ASSIGNMENTS] = True
                self.visitStatement(init)
                self.options[WARN_GLOBAL_ASSIGNMENTS] = False
                self.translateControlStructure(
                    node,
                    [LABEL(testLabel),
                     ('expr', test),
                     BranchIfTrue(topLabel),
                     LABEL(breakLabel),
                     ])
            else:
                continueLabel = self.newLabel(node)
                breakLabel = self.newLabel(node)
                self.context.setTarget('break', breakLabel)
                self.context.setTarget('continue', continueLabel)
                self.options[WARN_GLOBAL_ASSIGNMENTS] = True
                self.visitStatement(init)
                self.options[WARN_GLOBAL_ASSIGNMENTS] = False
                self.translateControlStructure(
                    node,
                    [0,
                     ('expr', test),
                     BranchIfFalse(breakLabel),
                     ('stmt', body),
                     LABEL(continueLabel),
                     ('stmt', step),
                     BRANCH(0),
                     LABEL(breakLabel)])
        finally:
            self.context = self.context.parent
            self.options = savedOptions

    def visitForInStatement(self, node, var, obj, body):
        self.translateForInStatement(node, var, SetVariable, obj, body)

    def visitForVarInStatement(self, node, var, _, obj, body):
        if self.options.get(ACTIVATION_OBJECT):
            self.translateForInStatement(node, var, SetVariable, obj, body)
            return
        self.translateForInStatement(node, var, VarEquals, obj, body)


    # This works because keys are always strings, and enumerate pushes
    # a null before all the keys
    def unwindEnumeration(self, node):
        "@sig public void unwindEnumeration(java.lang.Object node)"
        label = self.newLabel(node)
        self.emit(LABEL(label))
        self.push(Values.Null)
        self.emit(EQUALS)
        self.emit(NOT)
        self.emit(BranchIfTrue(label))

    def translateForInStatement(self, node, var, varset, obj, body):
        # TODO: [2003-04-15 ptw] bind context slot macro
        try:
            continueLabel = self.newLabel(node)
            breakLabel = self.newLabel(node)
            self.context = TranslationContext(ForInStatement, self.context)
            self.context.setTarget('break', breakLabel)
            self.context.setTarget('continue', continueLabel)
            self.context.isEnumeration = True
            r0 = 0
            self.visitExpression(obj)
            enumerate = [EnumerateValue]
            self.translateControlStructure(
                node,
                enumerate +
                [
                 LABEL(continueLabel),
                 SetRegister(r0),
                 PUSH(Values.Null),
                 EQUALS,
                 BranchIfTrue(breakLabel)])
            ref = self.translateReference(var).preset()
            self.emit(PUSH(Values.Register(0)))
            if varset is VarEquals:
                ref.init()
            else:
                ref.set(True)
            self.translateControlStructure(
                 node,
                 [('stmt', body),
                 BRANCH(continueLabel),
                 LABEL(breakLabel)])
        finally:
            self.context = self.context.parent

    def translateAbruptCompletion(self, node, type, label):
        targetContext = self.context.findLabeledContext(label and label.name)
        if not targetContext:
            if label:
                raise SemanticError("unknown %s target: %s" %
                                    (type, label.name), node)
            else:
                raise SemanticError("can't %s from current statement" % type,
                                    node)
        targetLabel = targetContext.getTarget(type)
        if targetLabel is None:
            raise SemanticError("can't %s from current statement" % type, node)
        # For each intervening enumeration, pop the stack
        c = self.context
        while c is not targetContext:
            c.emitBreakPreamble(node, self)
            c = c.getParentStatement()
        if type == 'break':
            targetContext.emitBreakPreamble(node, self)
        self.emit(BRANCH(targetLabel))

    def visitContinueStatement(self, node, label=None):
        self.translateAbruptCompletion(node, 'continue', label)

    def visitBreakStatement(self, node, label=None):
        self.translateAbruptCompletion(node, 'break', label)

    def visitReturnStatement(self, node, value):
        c = self.context
        while not c.isFunctionBoundary():
            c.emitBreakPreamble(node, self)
            c = c.getParentStatement()
            if not c:
                raise SemanticError("return not within a function body")
        self.visitExpression(value)
        if self.options.get(PROFILE) or self.options.get(DEBUG_BACKTRACE):
            self.emit(BRANCH(c.label))
        else:
            self.emit(RETURN)

    def visitWithStatement(self, node, expr, stmt):
        self.translateControlStructure(
            node,
            [('expr', expr),
             WITH(0),
             ('stmt', stmt),
             0])

    def visitSwitchStatement(self, node, expr, *clauses):
        tests = []
        targets = []
        defaultLabel = None
        label = self.newLabel(node)
        for clause in clauses:
            if clause.class is DefaultClause:
                assert not defaultLabel, \
                       SemanticError("duplicate default clause")
                defaultLabel = label
                # Empty cases share label with subsequent
                if len(clause) > 0:
                    targets.append((label, clause[0]))
                    label = self.newLabel(node)
            else:
                assert clause.class is CaseClause, 'case clause expected'
                tests.append((clause[0], label))
                # Empty cases share label with subsequent
                if len(clause) > 1:
                    targets.append((label, clause[1]))
                    label = self.newLabel(node)
        finalLabel = self.newLabel(node)
        # TODO: [2003-04-15 ptw] bind context slot macro
        try:
            self.context = TranslationContext(SwitchStatement, self.context)
            self.context.setTarget('break', finalLabel)
            self.visitExpression(expr)
            # TODO: [2002 ows] warn on duplicate tests
            for value, label in tests:
                self.emit(DUP)
                self.visitExpression(value)
                self.emit(EQUALS)
                self.emit(BranchIfTrue(label))
            self.emit(POP)
            self.emit(BRANCH(defaultLabel or finalLabel))
            nextLabel = None
            for label, stmt in targets:
                self.emit(LABEL(label))
                if label is not defaultLabel:
                    self.emit(POP)
                else:
                    defaultLabel = None
                if nextLabel:
                    self.emit(LABEL(nextLabel))
                    nextLabel = None
                self.visitStatement(stmt)
                if self.collector[len(self.collector)-1] not in \
                       (BRANCH, RETURN):
                    nextLabel = self.newLabel(node)
                    self.emit(BRANCH(nextLabel))
            # Handle fall-though in last clause
            if nextLabel:
                self.emit(LABEL(nextLabel))
            # Handle empty default as last clause
            if defaultLabel:
                self.emit(LABEL(defaultLabel))
            self.emit(LABEL(finalLabel))
        finally:
            self.context = self.context.parent

    def translateControlStructure(self, node, seq):
        # seq is a list whose items are interpreted thus:
        # - numbers are turned into labels
        # - target instructions have their targets, which are numbers,
        #   resolved to labels
        # - statements, expressions, and references are compiled
        #   as in fnmap
        # - all other instructions are emitted as is
        fnmap = {'stmt': lambda n:self.visitStatement(n),
                 'expr': self.visitExpression,
                 'ref': self.visitReference}
        # no control structure uses more than 10 labels (and we'll get a
        # signalled exception if one ever does, so this is safe)
        labels = [None] * 10
        def lookupLabel(n): # integer -> label
            l = labels[n]
            if l == None:
                l = labels[n] = self.newLabel(node)
            return l
        def resolveLocalLabel(instr):
            if type(instr) == type(0):
                return LABEL(lookupLabel(instr))
            if instr.getHasTarget() and type(instr.getTarget()) == type(0):
                return instr.replaceTarget(lookupLabel(instr.getTarget()))
            return instr
        # Ensure context targets are not ambiguous
        for k in self.context.targets.keySet():
            v = self.context.targets.get(k)
            assert type(v) != type(0), "Ambiguous context target %s" % v
        for item in seq:
            if type(item) is TupleType:
                fnmap[item[0]](item[1])
            else:
                # TODO [2004-03-04 ptw] Handle this in the assembler
                if type(item) is type(BranchIfFalse) and item.getIsBranchIfFalse():
                    self.emit(NOT)
                    item = BranchIfTrue(item.target)
                self.emit(resolveLocalLabel(item))

    #
    # Expressions
    #

    def isExpressionType(self, name):
        # There are several AST types that end with each of the names that
        # endswith tests for.
        return name.endswith('Expression') \
               or name[5:] in ('ExpressionList', 'Identifier') \
               or name.endswith('ExpressionSequence') \
               or name.endswith('Literal') \
               or name.endswith('Reference')

    def visitExpression(self, node, isReferenced=True):
        "@sig public void visitExpression(java.lang.Object node)"
        """This function, unlike the other expression visitors, can be
        applied to any expression node, so it dispatches based on the
        node's class.""" #'
        fn = self.getVisitor(node)
        self.showStats(node)
        if fn:
            name = fn.__name__
            assert self.isExpressionType(name), \
                   '%s is not an expression visitor' % name
            suppressed = fn(node, isReferenced, *node.children)
            if not isReferenced and not suppressed:
                self.emit(POP)
        else:
            raise CompilerImplementationError('unknown expression: %r' % node, node)

    def visitIdentifier(self, node, isReferenced):
        # Following is disabled by default for regression testing.
        # TODO: [2003-02-17 ows] enable this
        if not isReferenced and self.options.get(ELIMINATE_DEAD_EXPRESSIONS):
            return True
        if node.name == '_root' and not self.options.get(ALLOW_ROOT):
            raise SemanticError('Illegal variable name: %s' % node.name, node)
        self.translateReference(node).get()

    def visitLiteral(self, node, isReferenced):
        # Following is disabled by default for regression testing.
        # TODO: [2003-02-17 ows] enable this
        if not isReferenced and self.options.get(ELIMINATE_DEAD_EXPRESSIONS):
            return True
        value = self.translateLiteralNode(node)
        self.push(value)

    def visitExpressionList(self, node, isReferenced, *exprs):
        while exprs:
            expr = exprs[0]
            exprs = exprs[1:]
            suppressed = self.visitExpression(expr, not exprs)
        return suppressed

    def visitEmptyExpression(self, node, isReferenced):
        self.push(Values.Undefined)

    def visitThisReference(self, node, isReferenced):
        self.translateReference(node).get()

    def visitArrayLiteral(self, node, isReferenced, *items):
        items = list(items)
        items.reverse()
        for item in items:
            if item.class is EmptyExpression:
                self.push(Values.Undefined)
            else:
                self.visitExpression(item)
        self.push(len(items))
        self.emit(InitArray)

    def visitObjectLiteral(self, node, isReferenced, *items):
        isKey = True
        for item in items:
            if isKey and item.class is Identifier:
                self.push(item.name)
            else:
                self.visitExpression(item)
            isKey = not isKey
        self.push(len(items)/2)
        self.emit(InitObject)

    def visitFunctionExpression(self, node, isReferenced, *ast):
        savedOptions = self.options
        try:
            self.options = self.options.copy()
            self.options[CONSTRAINT_FUNCTION] = False
            # Make sure all our top-level functions have root context
            if self.context.type == Program:
                block = self.newLabel(node)
                self.push('_root')
                self.emit(GetVariable)
                self.emit(WITH(block))
            self.translateFunction(node, False, *ast)
            if self.context.type == Program:
                self.emit(LABEL(block))
        finally:
            self.options = savedOptions

    def visitCallParameters(self, node, isReferenced, args):
        args = list(args)
        # FIXME: [2002-01-07 ows] This evaluates function call
        # parameters in the wrong order.
        args.reverse()
        for expr in args:
            self.visitExpression(expr)
        self.push(len(args))

    # TODO: [2002-01-06 ows] Factor this and the visitCallParameters;
    # why are they both necessary?
    def visitFunctionCallParameters(self, node, isReferenced, *args):
        args = list(args)
        # FIXME: [2002-01-07 ows] This visits function call parameters
        # in the wrong order.
        args.reverse()
        for expr in args:
            self.visitExpression(expr)
        self.push(len(args))

    def visitPropertyIdentifierReference(self, node, isReferenced, *args):
        # TODO: [2002-12-12 ows] consolidate with the code in for..in
        # TODO: [2002-12-12 ows] find out how this generalizes to a.b.c
        # TODO: [2002-12-18 ows] enabling this saves 2K of the LFC, but
        # doesn't seem to improve speed, and changes the background color
        # of the menu items in contacts to white (don't know why).
        if False and args[0].class is Identifier and args[1].class is Identifier:
            self.push(args[0].name + ':' + args[1].name)
            self.emit(GetVariable)
            return
        self.translateReference(node).get()

    def visitPropertyValueReference(self, node, isReferenced, *args):
        self.translateReference(node).get()

    def visitCallExpression(self, node, isReferenced, fnexpr, args):
        nt = fnexpr.class
        arglen = len(args)
        if nt == Identifier:
            name = fnexpr.name
            # Expose getTimer at our API
            #
            # FIXME: [2002-12-23 ows] This substitution is not correct
            # because it assumes that the value for 'getTimer' that's
            # in scope is the global variable.
            if name == 'getTimer' and arglen == 0:
                self.emit(GetTimer)
                return
            if self.options.get(FLASH_COMPILER_COMPATABILITY):
                if name == 'trace':
                    if self.options.get(COMPILE_TRACE) == 'flash':
                        # FIXME: [2003-01-08 ows] Nicer warning for trace()
                        # FIXME: [2003-01-08 ows] Warn, at least, when
                        # there's more than one arg.
                        self.visitExpression(args[0])
                        # FIXME: [2003-03-13 ptw] Why doesn't the trace instruction work?
                        self.push(1)
                        self.push('trace')
                        self.emit(CallFunction)
                        return True
                    elif self.options.get(COMPILE_TRACE) == 'debug':
                        self.visitExpression(args[0])
                        self.push('_root')
                        self.emit(GetVariable)
                        self.push('Debug')
                        self.emit(GetMember)
                        self.push('write')
                        self.emit(CallMethod)
                        return
                    # else fall through
                    return True
                if name == 'fscommand' and arglen == 2:
                    assert args[0].class is Literal and StringType
                    v = self.translateLiteralNode(args[0])
                    assert isinstance(v, StringType)
                    self.push('FSCommand:' + v)
                    self.visitExpression(args[1])
                    self.emit(GetURL2)
                    return True
                if name == 'removeMovieClip' and arglen == 1:
                    self.visitExpression(args[0])
                    self.emit(RemoveClip)
                    return True         # no return value
                if name == 'ord' and arglen ==1:
                    self.visitExpression(args[0])
                    self.emit(ORD)
                    return
                if name == 'targetPath' and arglen == 1:
                    self.visitExpression(args[0])
                    self.emit(TargetPath)
                    return
                # TODO: [2002-11-30 ows] The following clause needs to
                # swap the arguments.  To preserve evaluation order,
                # it could visit them in reverse order if they don't
                # have side effects, otherwise emit SWAP.
                #- if name == 'getURL' and arglen == 2:
                #-    self.emit(GetURL2); return
                if name == 'getVersion' and arglen == 0:
                    self.push('/:$version')
                    self.emit(GetVariable)
                    return
                if name == 'eval' and arglen == 1:
                    self.visitExpression(args[0])
                    self.emit(GetVariable)
                    return

        # TODO: [2002-12-03 ptw] There should be a more general
        # mechanism for matching patterns against AST's and replacing
        # them.
        # FIXME: [2002-12-03 ptw] This substitution is not correct
        # because it does not verify that the method being inlined is
        # actually ViewsystemNode.setAttribute.
        # TODO: [2004-03-29 ptw] Enable this optimization for swf 7 by
        # allocating some temp registers if it is worth it
        if nt == PropertyIdentifierReference and \
           fnexpr[1].name == "setAttribute" and \
           arglen == 2 and \
           not self.options.get(FLASH_COMPILER_COMPATABILITY) and \
           not self.options.get(GENERATE_FUNCTION_2):
            onprop = [PUSH(('on', Values.Register(1))),
                      ADD]
            # Optimize literal property name
            # TODO: [2002-12-03 ptw] Should check for constant expression
            if args[0].class == Literal:
                v = self.translateLiteralNode(args[0])
                if isinstance(v, StringType):
                    onprop = [PUSH('on' + v)]
            self.translateControlStructure(
                # exprs are evaluated first, in proper order, and
                # before any registers are set (as they might be
                # clobbered by expression evaluation).
                node,
                [('expr', fnexpr[0]),   # : obj
                 DUP,                   # : obj, obj
                 ('expr', args[0]),     # : obj, obj, prop
                 ('expr', args[1]),     # : obj, obj, prop, val
                 SetRegister(3),        # r3 = val
                 POP,                   # : obj, obj, prop
                 SetRegister(1),        # r1 = prop
                 SWAP,                  # : obj, prop, obj
                 PUSH('setters'),       # : obj, prop, obj, setters
                 GetMember,             # : obj, prop, obj.setters
                 SWAP,                  # : obj, obj.setters, prop
                 GetMember,             # : obj, obj.setters[prop]
                 SetRegister(2),        # r2 = obj.setters[prop]
                 PUSH(Values.Null),     # : obj, obj.setters[prop], null
                 EQUALS,                # : obj, null == obj.setters[prop]
                 BranchIfTrue(0),       # : obj
                 SetRegister(0),        # r0 = obj
                 POP,                   # :
                 PUSH((Values.Register(3), # : val
                      1,                # : val, 1
                      Values.Register(0), # : val, 1, obj
                      Values.Register(2))), # : val, 1, obj, setter
                 BRANCH(1),
                 0,                     # : obj
                 SetRegister(0),        # r0 = obj
                 PUSH((Values.Register(1), # : obj, prop
                      Values.Register(3))), # : obj, prop, val
                 SetMember,             # :
                 PUSH((Values.Register(3), # : val
                      1,                # : val, 1
                      Values.Register(0)))] + \
                onprop + \
                [GetMember,             # : val, 1, obj['on'+prop]
                 PUSH('sendEvent'),     # : val, 1, obj['on'+prop], 'sendEvent'
                 1,
                 CallMethod,            # : result
                 POP])                  # :
            return True                 # no return value

        self.visitCallParameters(node, isReferenced, args)
        isref = self.visitReference(fnexpr, checkDefined=True, node=node)
        if isref:
            if nt in (PropertyIdentifierReference,
                      PropertyValueReference):
                self.emit(CallMethod)
            else:
                self.emit(CallFunction)
        else:
            # This is how you invoke a function value
            self.push(Values.Undefined)
            self.emit(CallMethod)

    def visitSuperCallExpression(self, node, isReferenced, fname, args):
        if fname.class is EmptyExpression:
            name = 'constructor'
        else:
            name = fname.name
        methodName = self.options.get(METHOD_NAME)
        if not methodName == name:
            supplement = ''
            if methodName.lower() == name.lower():
                supplement = ".  The method names must have the same capitalization."
            raise UnimplementedError("unimplemented: calling super.%s from %s%s" % (name, methodName, supplement), node)
        # FIXME: [2005-03-09 ptw] (LPP-98 'Compiler source-source
        # transformations should be in separate phase') This should be
        # in a phase before the compiler, so that register analysis
        # sees it.  [Or this should be eliminated altogether and we
        # should use swf7's real super call, but that will mean we
        # have to solve the __proto__ vs. super in constructor
        # problem.]
        import java.util.HashMap
        map = java.util.HashMap()
        map['_1'] = Literal(name)
        map['_2'] = Compiler.Splice(args.children)
        n = Compiler.Parser().substitute("this.__LZcallInherited(_1, arguments.callee, _2)", map)
        self.visitCallExpression(n, isReferenced, *n.children)

    def visitNewExpression(self, node, isReferenced, ref):
        args = ()
        if ref.class is CallExpression:
            ref, args = ref.children
        self.visitCallParameters(node, isReferenced, args)
        isref = self.visitReference(ref, checkDefined=True, node=node)
        if isref:
            if ref.class in (PropertyIdentifierReference,
                             PropertyValueReference):
                self.emit(NewMethod)
            else:
                self.emit(NEW)
        else:
            self.push(Values.Undefined)
            self.emit(NewMethod)

    def visitPrefixExpression(self, node, isReferenced, op, ref):
        return self.translateXfixExpression(ref, op, isPrefix=True,
                                            isReferenced=isReferenced)

    def visitPostfixExpression(self, node, isReferenced, ref, op):
        return self.translateXfixExpression(ref, op, isPrefix=False,
                                            isReferenced=isReferenced)

    def translateXfixExpression(self, ref, op, isPrefix, isReferenced):
        newValueIsUsed = isReferenced and isPrefix
        oldValueIsUsed = isReferenced and not isPrefix
        op = XfixInstrs[op.operator]
        if oldValueIsUsed:
            ref = self.translateReference(ref, 3).get().preset().get()
            self.emit(op)
            ref.set()
        elif newValueIsUsed:
            ref = self.translateReference(ref, 2).preset().get()
            self.emit(op)
            self.emit(SetRegister(0))
            ref.set()
            self.push(Values.Register(0))
        else:
            ref = self.translateReference(ref, 2).preset().get()
            self.emit(op)
            ref.set()
            return True

    def visitUnaryExpression(self, node, isReferenced, op_, a):
        op = op_.operator
        if op in (Ops.INCR, Ops.DECR):
            return self.visitPrefixExpression(node, isReferenced, op_, a)
        # a little bit of constant-folding, so that '-1' looks like a constant
        if op == Ops.MINUS and a.class is Literal:
            v = self.translateLiteralNode(a)
            if isinstance(v, IntType) or isinstance(v, LongType) \
                   or isinstance(v, FloatType):
                self.push(-v)
                return
        # special-cased, since this operates on a ref rather than a value
        if op == Ops.DELETE:
            isref = self.visitReference(a)
            if isref:
                self.emit(DELETE)
            else:
                self.emit(DELETE2)
            return
        if self.options.get(FLASH_COMPILER_COMPATABILITY) and op == Ops.MINUS:
            self.push(0)
            self.visitExpression(a)
            self.emit(SUBTRACT)
            return
        # special-case typeof(variable) to not emit undefined-variable
        # checks so there is a warning-free way to check for undefined
        if op == Ops.TYPEOF and a.class in \
               (Identifier, PropertyValueReference, PropertyIdentifierReference):
            self.translateReference(a).get(False)
        else:
            self.visitExpression(a)
        instrs = UnopInstrs[op]
        if op == Ops.TILDE and \
               self.options.get(FLASH_COMPILER_COMPATABILITY):
            instrs = [PUSH(0xffffffffL),
                      BitwiseXor]
        for instr in instrs:
            self.emit(instr)

    def visitBinaryExpressionSequence(self, node, isReferenced, a, op, b):
        return self.visitBinaryExpression(node, isReferenced, op, a, b)

    def visitBinaryExpression(self, node, isReferenced, op, a, b):
        op = op.operator
        instrs = BinopInstrs[op]
        self.visitExpression(a)
        self.visitExpression(b)
        for instr in instrs:
            self.emit(instr)

    def visitAndExpressionSequence(self, node, isReferenced, a, b):
        self.translateAndOrExpression(node, True, a, b)

    def visitOrExpressionSequence(self, node, isReferenced, a, b):
        self.translateAndOrExpression(node, False, a, b)

    def translateAndOrExpression(self, node, isand, a, b):
        self.visitExpression(a)
        self.emit(DUP)
        if isand:
            self.emit(NOT)
        label = self.newLabel(node)
        self.emit(BranchIfTrue(label))
        self.emit(POP)
        self.visitExpression(b)
        self.emit(LABEL(label))

    def visitConditionalExpression(self, node, isReferenced, test, a, b):
        l1 = self.newLabel(node)
        l2 = self.newLabel(node)
        self.visitExpression(test)
        self.emit(BranchIfTrue(l1))
        self.visitExpression(b)
        self.emit(BRANCH(l2))
        self.emit(LABEL(l1))
        self.visitExpression(a)
        self.emit(LABEL(l2))

    def visitAssignmentExpression(self, node, isReferenced, lhs, op, rhs):
        op = op.operator
        if op == Ops.ASSIGN:
            ref = self.translateReference(lhs).preset()
            self.visitExpression(rhs)
            if isReferenced:
                self.emit(SetRegister(0))
        else:
            op = AssignOpTable[op]
            ref = self.translateReference(lhs, 2).preset()
            ref.get()
            self.visitExpression(rhs)
            for instr in BinopInstrs[op]:
                self.emit(instr)
            if isReferenced:
                self.emit(SetRegister(0))
        ref.set()
        if isReferenced:
            self.push(Values.Register(0))
        return True

    def translateFunction(self, node, useName, *children):
        # label for profiling return
        label = self.newLabel(node)
        # TODO: [2003-04-15 ptw] bind context slot macro
        try:
            previousContext = self.context
            self.context = TranslationContext(FunctionExpression, previousContext, label)
            dependencies = self.translateFunctionInternal(node, useName, *children)
        finally:
            self.context = previousContext
        # Dependency function is not compiled in the function context
        if dependencies:
            self.emit(DUP)
            self.push('dependencies')
            self.visitExpression(dependencies)
            self.emit(SetMember)

    # Internal helper function for above
    def translateFunctionInternal(self, node, useName, *children):
        # ast can be any of:
        #   FunctionDefinition(name, args, body)
        #   FunctionDeclaration(name, args, body)
        #   FunctionDeclaration(args, body)
        # Handle the two arities:
        if len(children) == 3:
            functionNameIdentifier, params, stmts = children
            functionName = functionNameIdentifier.name
        else:
            params, stmts = children
            functionName = None

        # function block
        block = self.newLabel(node)
        if functionName:
            userFunctionName = functionName
            self.options[METHOD_NAME] = functionName[functionName.rfind('.')+1:]
        else:
            # TODO: [2003-06-19 ptw] (krank) Sanitization of names to
            # identifiers moved to krank user, remove #- when it works
            #- from string import translate, maketrans
            #- trans = maketrans(" /.", "___")
            #- filename = translateInternal(node.filename or 'unknown file', trans, '"');
            # Why do .as filenames have quotes around the string?
            filename = node.filename or 'unknown file'
            #- userFunctionName = '%s$%d_%d' % (filename, node.lineNumber, node.columnNumber)
            userFunctionName = '%s#%d/%d' % (filename, node.lineNumber, node.columnNumber)
        if not useName:
            functionName = None
        # Tell metering to look up the name at runtime if it is not a
        # global name (this allows us to name closures more
        # mnemonically at runtime
        meterFunctionName = functionName
        # For warnings
        import sys
        filename, lineno = getSourceLocation(node)
        pnames = [p.name for p in params.children]
        # Pull all the pragmas from the beginning of the
        # statement list: process them, and remove them
        assert stmts.class == StatementList
        stmts = list(stmts.children)
        while stmts and stmts[0].class is PragmaDirective:
            self.visitStatement(stmts[0])
            del stmts[0]
        prefix = []
        postfix = []
        if self.options.get(DEBUG_BACKTRACE):
            prefix.extend(list(Compiler.Parser().parse(" \
              { \
                \n#pragma 'warnUndefinedReferences=false'\n \
                var $lzsc$s = _root.__LzDebug['backtraceStack']; \
                if ($lzsc$s) { \
                  var $lzsc$l = $lzsc$s.length; \
                  $lzsc$s.length = $lzsc$l + 1; \
                  arguments['this'] = this; \
                  $lzsc$s[$lzsc$l] = arguments; \
                } \
              } \
              ").children))
            # TODO: [2005-05-12 ptw] (LPP-350) Until we analyze
            # $flasm, have to re-establish our vars here because
            # $flasm may have clobbered them if registered
            postfix.extend(list(Compiler.Parser().parse(" \
              { \
                \n#pragma 'warnUndefinedReferences=false'\n \
                var $lzsc$s = _root.__LzDebug['backtraceStack']; \
                if ($lzsc$s) { \
                  $lzsc$s.length--; \
                } \
              } \
              ").children))
        if self.options.get(PROFILE):
            print 'profile', self.options.get(PROFILE)
            prefix.extend(meterFunctionEvent(self, node, 'calls', meterFunctionName))
            postfix.extend(meterFunctionEvent(self, node, 'returns', meterFunctionName))

        # Analyze local variables (and functions)
        analyzer = VariableAnalyzer(params, self.options.getBoolean(FLASH_COMPILER_COMPATABILITY))
        for analyze in (prefix, stmts, postfix):
            for stmt in analyze:
                analyzer.visit(stmt)
        analyzer.computeReferences()
        # Convert Java sets to lists
        pnames = [v for v in analyzer.parameters]
        variables = []
        i = analyzer.variables.iterator()
        while i.hasNext():
            variables.append(i.next())
        fundefs = {}
        for key in analyzer.fundefs.keySet():
            fundefs[key] = analyzer.fundefs.get(key)
        closed = [v for v in analyzer.closed]
        free = [v for v in analyzer.free]
        # Note usage due to activation object and withThis
        if free:
            # TODO: [2005-06-29 ptw] with (_root) should not be
            # necessary for the activation object case now that it is
            # done at top level to get [[scope]] right.
            if self.options.get(ACTIVATION_OBJECT):
                analyzer.incrementUsed('_root')
            if self.options.get(WITH_THIS):
                analyzer.incrementUsed('this')
        used = analyzer.used
        # If this is a closure, annotate the Username for metering
        if closed and not functionName and self.options.get(PROFILE):
            # Is there any other way to construct a closure in js
            # other than a function returning a function?
            if self.context.findFunctionContext().parent.findFunctionContext():
                userFunctionName = "%s.%s" % (closed, userFunctionName)
        ## print userFunctionName, 'pnames', pnames, 'variables', variables, 'fundefs', fundefs, 'used', used, 'closed', closed, 'free', free
        # Deal with warnings
        if self.options.get(WARN_UNUSED_PARAMETERS):
            unusedParams = [ v for v in pnames if not used.containsKey(v) ]
            for v in unusedParams:
                print >> sys.stderr, \
                      "Warning: parameter %s of %s unused in %s(%s)" % \
                      (v, userFunctionName, filename, lineno)
        if self.options.get(WARN_UNUSED_LOCALS):
            unusedVariables = [ v for v in variables if not used.containsKey(v) ]
            for v in unusedVariables:
                print >> sys.stderr, \
                      "Warning: variable %s of %s unused in %s(%s)" % \
                      (v, userFunctionName, filename, lineno)
        # auto-declared locals
        auto = [n for n in Instructions.Register.AUTO_REG if used.containsKey(n)]
        # parameters, locals, and auto-registers
        known = list(pnames) + variables[:] + auto
        # for now, ensure that super has a value
        if 'super' in known:
            known.remove('super')
        import java.util.HashSet as HashSet
        knownSet = HashSet()
        lowerKnownSet = HashSet()
        for v in known:
            knownSet.add(v)
            lowerKnownSet.add(v.lower())
        self.context.setProperty(TranslationContext.VARIABLES, knownSet)
        self.context.setProperty(TranslationContext.LOWERVARIABLES, lowerKnownSet)

        scriptElement = self.options.get(SCRIPT_ELEMENT)
        import java.util.HashMap as HashMap
        registerMap = HashMap()
        lowerRegisterMap = HashMap()
        # Always set register map.  Inner functions should not see
        # parent registers (which they would if the setting of the
        # registermap were conditional on function vs. function2)
        self.context.setProperty(TranslationContext.REGISTERS, registerMap)
        self.context.setProperty(TranslationContext.LOWERREGISTERS, lowerRegisterMap)
        # TODO: [2004-03-24] Analyze register usage in $flasm and
        # account for it (or rename $flasm regs?)
        # NB: Only Flash Player 6r65 or better understands function2
        if self.options.get(GENERATE_FUNCTION_2) and \
           (self.options.get(FLASH_COMPILER_COMPATABILITY) or \
            self.options.get(GENERATE_FUNCTION_2_FOR_LZX)) and \
           not scriptElement and \
           not used.containsKey('eval') and \
           not used.containsKey('$flasm'):
            autoRegisters = [Instructions.Register.make(n) for n in auto]
            fnArgs = autoRegisters[:]
            paramRegisters = []
            varRegisters = []
            # TODO: [2004-03-27 ptw] Should use threshold for
            # parameters be 0 or 1?  Presumably there is a getVariable
            # cost to loading the register.
            for v in pnames:
                if used.containsKey(v) and v not in closed:
                    reg = Instructions.Register.make(v)
                    fnArgs.append(reg)
                    paramRegisters.append(reg)
                else:
                    # Always accept the arg, even if not used, since they are positional
                    fnArgs.append(v)
            # For determinism
            if variables:
                variables.sort()
            # Makes ths sort below stable
            index = 0
            for v in variables:
                if used.containsKey(v) and v not in closed:
                    reg = Instructions.Register.make(v)
                    varRegisters.append((used.get(v), index, reg))
                    index = index + 1
                else:
                    pass
            if autoRegisters or paramRegisters or varRegisters:
                # Don't know how Flash assigns registers (one would
                # have thought the parameters should be in stack order
                # and others by frequency of use), but we do know the
                # auto registers always come first in order and r:0 is
                # never assigned.  It appears the parameters are
                # assigned last.
                # TODO: [2004-03-29 ptw] Measure the cost of loading a
                # parameter register so we know whether to weight them
                # the same as var registers when there aren't enough
                # registers
                paramRegisters.reverse()
                varRegisters.sort()
                varRegisters.reverse()
                registers = autoRegisters[:] + [ v for (u, i, v) in varRegisters] + paramRegisters
                # Assign register numbers [1, 255]
                registers = registers[:254]
                regno = 1
                for r in registers:
                    r.regno = regno
                    regno = regno + 1
                    registerMap.put(r.name, r)
                    lowerRegisterMap.put(r.name.lower(), r)
                # It appears you have to always allocate r:0, hence
                # regno, not len(registers)
                self.emit(DefineFunction2((block, functionName, regno, ) + tuple(fnArgs)))
            else:
                self.emit(DefineFunction((block, functionName, ) + tuple(pnames)))
        else:
            self.emit(DefineFunction((block, functionName, ) + tuple(pnames)))

        activationObjectSize = 0
        if scriptElement:
            if variables:
                # Create all variables (including inner functions) in global scope
                if registerMap.containsKey('_root'):
                    self.push(Values.Register(registerMap.get('_root').regno))
                else:
                    self.push('_root')
                    self.emit(GetVariable)
                # Optimization dups fetch of root for all but last which consumes it
                for variable in variables[:-1]:
                    self.emit(DUP)
                    self.push(variable)
                    self.push(Values.Undefined)
                    self.emit(SetMember)
                variable = variables[-1]
                self.push(variable)
                self.push(Values.Undefined)
                self.emit(SetMember)
        else:
            # create unregistered, used variables in activation context
            toCreate = [v for v in variables if used.containsKey(v) and not registerMap.containsKey(v)]
            if self.options.get(ACTIVATION_OBJECT):
                for variable in toCreate:
                    self.push(variable)
                    self.push(Values.Undefined)
                    activationObjectSize += 1
            else:
                for variable in toCreate:
                    self.push(variable)
                    self.emit(VAR)
        # create unregistered, used parameters in activation context
        # (only needed for activation object, they are already in context)
        if self.options.get(ACTIVATION_OBJECT):
            toCreate = [v for v in pnames if used.containsKey(v) and not registerMap.containsKey(v)]
            for param in toCreate:
                self.push(param)
                self.push(param)
                self.emit(GetVariable)
                activationObjectSize += 1
        if activationObjectSize > 0:
            self.push(activationObjectSize)
            self.emit(InitObject)
        # scriptElements must be compiled inside with(_root) -- that
        # is their required environment because all their local
        # bindings are transformed to _root bindings (and will not be
        # if they are loaded as snippets)

        # TODO: [2005-06-29 ptw] with (_root) should not be necessary
        # for the activation object case now that it is done at top
        # level to get [[scope]] right.
        if ( free and activationObjectSize > 0 ) or \
               scriptElement:
            if registerMap.containsKey('_root'):
                self.push(Values.Register(registerMap.get('_root').regno))
            else:
                self.push('_root')
                self.emit(GetVariable)
            self.emit(WITH(block))
        if free and self.options.get(WITH_THIS):
            if registerMap.containsKey('this'):
                self.push(Values.Register(registerMap.get('this').regno))
            else:
                self.push('this')
                self.emit(GetVariable)
            self.emit(WITH(block))
        if activationObjectSize > 0:
            self.emit(WITH(block))
        # inner functions do not get scriptElement treatment
        self.options[SCRIPT_ELEMENT] = False
        # Now emit functions in the activation context
        if scriptElement:
            # create functions in global scope
            # Note: variable has already been declared so SetVariable
            # does the right thing
            for name, fun in fundefs.items():
                self.push(name)
                self.translateFunction(fun, False, *fun.children)
                self.emit(SetVariable)
        else:
            for name, fun in fundefs.items():
                if used.containsKey(name):
                    if not registerMap.containsKey(name):
                        self.push(name)
                    self.translateFunction(fun, False, *fun.children)
                    if registerMap.containsKey(name):
                        self.emit(SetRegister(registerMap.get(name).regno))
                        self.emit(POP)
                    else:
                        self.emit(SetVariable)
        # end of else scriptElement
        if prefix:
            self.visitStatementList(node, *prefix)
            # label flushes optimizer
            self.emit(LABEL(self.newLabel(node)))
        self.visitStatementList(node, *stmts)
        # runtime handles implicit return except if postfix
        if postfix:
            self.push(Values.Undefined)
            self.emit(LABEL(self.context.findFunctionContext().label))
            self.visitStatementList(node, *postfix)
            self.emit(RETURN)
        # close function
        self.emit(LABEL(block))
        if self.options.get(NAME_FUNCTIONS):
            if functionName:
                # Named functions do not leave a value on the stack
                self.push(functionName)
                self.emit(GetVariable)
            else:
                # Function expression leaves function on stack
                self.emit(DUP)
            self.push('name')
            self.push(userFunctionName)
            self.emit(SetMember)
        if self.options.get(CONSTRAINT_FUNCTION):
            assert not functionName
            if ReferenceCollector.DebugConstraints:
                print 'stmts: ', stmts
            # Find dependencies.
            #
            # The job of a constraint function is to compute a value.
            # The current implementation inlines the call to set the
            # attribute that the constraint is attached to, within the
            # constraint function itself.  Walking the statements of
            # the function will process the expression that computes
            # the value; it will also process the call to
            # setAttribute, but ReferenceCollector knows to ignore
            # this.
            dependencies = ReferenceCollector(self.options.getBoolean(COMPUTE_METAREFERENCES))
            for stmt in stmts:
                dependencies.visit(stmt)
            expr = dependencies.computeReferences(userFunctionName)
            if self.options.get(PRINT_CONSTRAINTS):
                ParseTreePrinter().print(expr)
            return expr
        return None
    
    def translateLiteralNode(self, node):
        value = node.value
        if value is None:
            return Values.Null
        elif isinstance(value, IntType):
            return {0: Values.False, 1: Values.True}[value]
        return value

    def visitReference(self, ast, checkDefined=False, node=None):
        """Contract is to leave a reference on the stack that will be
        dereferenced by CallFunction, etc.  Returns true if it
        succeeds.  Returns false if the ast is such that only the
        value of the reference can be pushed.  In this case, the
        callee, must use 'CallMethod UNDEF' to call the value
        instead"""
        if checkDefined:
            assert node!=None, 'Must supply node for checkDefined'
        nodeType = ast.class
        if nodeType is PropertyIdentifierReference:
            self.translateReference(ast[0]).get()
            if checkDefined:
                checkUndefinedMethod(
                    self,
                    node,
                    ast[1].name)
            self.push(ast[1].name)
            return True
        if nodeType is PropertyValueReference:
            # TODO: [2002-10-26 ptw] (undefined reference coverage) Check
            self.translateReference(ast[0]).get()
            self.visitExpression(ast[1])
            return True
        # The only other reason you visit a reference is to make a funcall
        isref = True
        if nodeType == Identifier:
            ref = self.translateReference(ast)
            if ref.register:
                ref.get()
                isref = False
            else:
                ref.preset()
        else:
            self.visitExpression(ast)
            isref = False
        if checkDefined:
            checkUndefinedFunction(
                self,
                node,
                isref and nodeType == Identifier and  ast.name)
        return isref

    def translateReference(self, node, referenceCount=1):
        if node.class is Identifier:
            return VariableReference(self, node, referenceCount, node.name)
        if node.class is ThisReference:
            return VariableReference(self, node, referenceCount, "this")
        if node.class in (ArrayLiteral, Literal, ObjectLiteral, CallExpression, NewExpression):
            return LiteralReference(self, node, referenceCount)
        args = node.children
        if node.class == PropertyIdentifierReference:
            return PropertyReference(self, node, referenceCount, *args)
        elif node.class == PropertyValueReference:
            return IndexReference(self, node, referenceCount, *args)
        else:
            raise SemanticError('Invalid reference expression: %s' % ParseTreePrinter().visit(node), node)

    def compileInlineAssembly(self, statements, index):
        # skip $flasm
        i = index + 1
        while True:
            stmt = i < len(statements) and statements[i]
            i = i + 1
            if stmt and stmt.class is Statement:
                pass
            else:
                raise SemanticError("Unterminated $flasm block", node)
            node = stmt[0]
            nt = node.class
            if nt is Identifier and node.name == "$end":
                # skip $end
                i = i + 1
                break
            if nt is Literal and type(node.value) is StringType:
                pass
            else:
                raise SemanticError("Invalid flasm statement %s" %
                                    node, node)
            instructions = parseInstructions(node.value)
            if self.options.get(PROFILE):
                def profiled_emit(instr):
                    if instr is RETURN:
                        self.emit(BRANCH(self.context.findFunctionContext().label))
                    else:
                        self.emit(instr)
                for instr in instructions:
                    profiled_emit(instr)
            else:
                for instr in instructions:
                    self.emit(instr)
        return i

# Compiles a sequences of assignment statements, starting at
# statements[index], and returns the index of the first statement not
# compiled, or None if no statement was compiled.  (This will be the
# case if statements[index] is not an appropriate (see below)
# assignment statement).
#
# All the statements in the sequence must be to properties with the
# same base, e.g. a.b and a.c, or a.b.c and a.b.d.
#
# If obfuscate is true, the values are pushed onto the stack inside a
# call to an anonymous function that's placed on the stack,, but
# consumed outside the function.  This foils the ASV ActionScript
# decompiler.  For example, 'a.b = 1' is compiled as:
#
# function () {push 'a', 'b', 1}() # leaves values on stack
# setMember # consumes the values

# Only called with obfuscate=True for top-level assignments.  Since
# this hides most of the functions, additionally obfuscation is
# unnecessary and also has greater performance costs.
def compileAssignments(generator, statements, index, obfuscate=False):
    # TODO: [2004-03-26 ptw] Does not work in the presence of
    # registers because of the GetVariable optimization -- rewrite as
    # a source transformation
    if generator.options.get(GENERATE_FUNCTION_2):
        return None
    node = statements[index]
    children = node.children
    if not children:
        return None
    def getAssignmentBase(node):
        if node.class is AssignmentExpression \
               and node[1].operator == Ops.ASSIGN \
               and node[0].class is PropertyIdentifierReference:
            return node[0][0]
    def nodeEquals(a, b):
        # TODO: [2002-12-02 ows] The Java AST classes should
        # implement this instead.
        if not a or not b:
            return False
        type = a.class
        if type is not b.class:
            return False
        if type is Identifier:
            return a.name == b.name
        if type is ThisReference:
            return True
        if type is PropertyIdentifierReference:
            return nodeEquals(a[0], b[0]) and a[1].name == b[1].name
    base = getAssignmentBase(children[0])
    if not base:
        return None
    # A stable expression is one whose value won't be changed by an
    # assignment to a property reference, that doesn't modify r0, and
    # that doesn't have side effects.  False negatives are okay.
    def isStableExpression(node):
        nt = node.class
        return nt in (Identifier, Literal, FunctionExpression)
    # Collect the assignments of values returned by stable
    # expressions, to the same base.  j is left pointing one past the
    # last assignment.
    j = index+1
    while True:
        next = j < len(statements) and statements[j]
        nextbase = next and next.class is Statement and \
                   next.children and getAssignmentBase(next[0])
        if not nodeEquals(base, nextbase):
            break
        value = next[0][2]
        if not isStableExpression(value):
            break
        j = j + 1
    # As an optimization, this is only worthwhile if there's more than
    # one assignment to the same base.  As an obfuscation, it's worth
    # doing even if there's only one.
    if not obfuscate and j - index < 2: return None
    if obfuscate:
        label = generator.newLabel(node)
        generator.emit(DefineFunction((label, None, )))
    generator.visitExpression(base)
    # : base
    generator.emit(SetRegister(0))
    # : base
    # visit values, in reverse order
    getvars = [] # array of flags for whether to call GetVariable
    firstTime = True
    for i in range(j-1, index-1, -1):
        # ...
        if firstTime:
            firstTime = False
        else:
            generator.push(Values.Register(0))
        # : ..., base
        prop = statements[i][0][0][1].name
        generator.push(prop)
        # : ..., base, prop
        value = statements[i][0][2]
        if value.class is Identifier:
            # Special-case this so that the GetVariable can be done
            # later, where it doesn't break up a sequence of push
            # arguments
            generator.push(value.name)
            getvars.append(True)
        else:
            generator.visitExpression(value)
            getvars.append(False)
        # : ..., base, prop, value
    if obfuscate:
        generator.emit(LABEL(label))
        # : fn
        # This is how you invoke a function value
        generator.push(Values.Undefined)
        # : fn, Undefined
        generator.emit(CallMethod)
        # : base, prop, value, ..., Undefined
        generator.emit(POP)
    # : base, prop, value, base, prop, value, ...
    for i in range(index, j):
        if getvars.pop():
            generator.emit(GetVariable)
        # : ..., base, prop, value
        generator.emit(SetMember)
        # : ...
    # : [empty]
    return j


