/* *****************************************************************************
 * DependencyTracker.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004, 2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/


package org.openlaszlo.cm;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Set;

import org.openlaszlo.compiler.CompilationEnvironment;
import org.openlaszlo.compiler.FileResolver;

/** A FileResolver that tracks dependencies.
*
* @author Oliver Steele
*/
public class TrackingFileResolver implements FileResolver {
   private final FileResolver mBaseResolver;
   private final DependencyTracker mDependencies;

   public TrackingFileResolver(FileResolver baseResolver,
                        DependencyTracker tracker) {
       this.mBaseResolver = baseResolver;
       this.mDependencies = tracker;
   }
   
   public Set getBinaryIncludes() { return mBaseResolver.getBinaryIncludes(); }

   /**
    * Implement the FileResolver interface.
    *
    * @param pathname a <code>String</code> value
    * @param base a <code>String</code> value
    * @param asLibrary a <code>boolean</code> value
    * @return a <code>File</code> value
    * @exception FileNotFoundException if an error occurs
    */
   public File resolve(String pathname, String base, boolean asLibrary)
       throws FileNotFoundException
   {
       File file = mBaseResolver.resolve(pathname, base, asLibrary);
       mDependencies.addFile(file);
       return file;
   }

   public File resolve(CompilationEnvironment env, String pathname, String base, boolean asLibrary)
       throws FileNotFoundException
   {
       File file = mBaseResolver.resolve(env, pathname, base, asLibrary);
       mDependencies.addFile(file);
       return file;
   }


   /** For debugging. */
   /*void writeResults() {
       System.out.println("depends on");
       for (java.util.Iterator e = mDependencies.iterator();
            e.hasNext(); ) {
            FileInfo fi = (FileInfo) e.next();
           System.out.println(fi.mPathname + " -> " + fi.mChecksum);
       }
       }*/
}
