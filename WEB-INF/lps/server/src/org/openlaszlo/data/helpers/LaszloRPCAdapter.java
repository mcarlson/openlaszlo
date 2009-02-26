/* ****************************************************************************
 * JavaDataSource.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.data.helpers;

import javax.servlet.http.HttpServletRequest;
import java.util.LinkedList;
import java.util.List;


/**
 * @author sebastianwagner
 *
 */
public class LaszloRPCAdapter implements ILaszloRPCAdapter {
    
    public HttpServletRequest servletRequest;
    
    //List<LaszloTypeMapping> typeMappings = new LinkedList<LaszloTypeMapping>();
    List typeMappings = new LinkedList();
    
    /*
     * Add a Custom Mapping Type
     */
    public void addCustomMappings(LaszloTypeMapping typeMappings){
        this.typeMappings.add(typeMappings);
    }
    
    /* (non-Javadoc)
     * 
     */
    public List getCustomMappings(){
        return this.typeMappings;
    }

    /* (non-Javadoc)
     * @see org.openlaszlo.data.helpers.ILaszloRPCAdapter#onCall(java.lang.String, java.lang.Class[], java.lang.Object[])
     */
    public void onCall(String methodName, Class[] argClasses, Object[] argValues) {
        // TODO Auto-generated method stub
        
    }

    /* (non-Javadoc)
     * @see org.openlaszlo.data.helpers.ILaszloRPCAdapter#onMappingNotFound(java.lang.String)
     */
    public void onMappingNotFound(String neededType, Object value) {
        // TODO Auto-generated method stub
        
    }
    
}
