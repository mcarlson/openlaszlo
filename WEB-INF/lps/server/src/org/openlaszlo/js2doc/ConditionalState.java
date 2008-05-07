/* *****************************************************************************
 * JS2Doc.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2006-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.js2doc;

import java.util.*;
import java.util.logging.*;


/**

 */
public class ConditionalState {

    static private Logger logger = Logger.getLogger("org.openlaszlo.js2doc");

    public static final int indeterminateValue = 0;
    public static final int falseValue = 1;
    public static final int trueValue = 2;
    public int inferredValue;
    
    public HashSet trueCases;
    public HashSet falseCases;
    public Set exclusiveOptions;
    public List independentOptions;

    public ConditionalState(int value, Set exclusiveOptions, List independentOptions) {
        this.inferredValue = value;
        this.trueCases = new HashSet();
        this.falseCases = new HashSet();
        this.exclusiveOptions = exclusiveOptions;
        this.independentOptions = independentOptions;
    }
    
    public ConditionalState(ConditionalState origState) {
        this(falseValue, origState.exclusiveOptions, origState.independentOptions);
        if (origState != null) {
            this.inferredValue = origState.inferredValue;
            this.trueCases.addAll(origState.trueCases);
            this.falseCases.addAll(origState.falseCases);
        }
    }

    public void addTrueCase(String option) {
        this.inferredValue = ConditionalState.indeterminateValue;
        this.trueCases.add(option);
        this.falseCases.remove(option);
    }
    
    public void addFalseCase(String option) {
        this.inferredValue = ConditionalState.indeterminateValue;
        this.trueCases.remove(option);
        this.falseCases.add(option);
    }
    
    public ConditionalState or(ConditionalState operand) {
        ConditionalState newState = new ConditionalState(falseValue, this.exclusiveOptions, this.independentOptions);
        switch (this.inferredValue) {
            case indeterminateValue:
                switch (operand.inferredValue) {
                    case indeterminateValue:
                        newState.inferredValue = indeterminateValue;
                        newState.trueCases.addAll(this.trueCases);
                        newState.trueCases.addAll(operand.trueCases);
                        newState.falseCases.addAll(this.falseCases);
                        newState.falseCases.addAll(operand.falseCases);
                        break;
                    case trueValue:
                        newState.inferredValue = trueValue;
                        break;
                    case falseValue:
                        newState.inferredValue = indeterminateValue;
                        newState.trueCases.addAll(this.trueCases);
                        newState.falseCases.addAll(this.falseCases);
                        break;
                }
                break;
            case trueValue:
                newState.inferredValue = trueValue;
                break;
            case falseValue:
                switch (operand.inferredValue) {
                    case indeterminateValue:
                        newState.inferredValue = indeterminateValue;
                        newState.trueCases.addAll(operand.trueCases);
                        newState.falseCases.addAll(operand.falseCases);
                        break;
                    case trueValue:
                        newState.inferredValue = trueValue;
                        break;
                    case falseValue:
                        newState.inferredValue = falseValue;
                        break;
                }
                break;
        }
        return newState;
    }
    
    public ConditionalState and(ConditionalState operand) {
        ConditionalState newState = new ConditionalState(falseValue, this.exclusiveOptions, this.independentOptions);
        switch (this.inferredValue) {
            case indeterminateValue:
                switch (operand.inferredValue) {
                    case indeterminateValue:
                        newState.inferredValue = indeterminateValue;
                        newState.trueCases.addAll(this.trueCases);
                        newState.trueCases.addAll(operand.trueCases);
                        newState.falseCases.addAll(this.falseCases);
                        newState.falseCases.addAll(operand.falseCases);
                        // TO DO [jgrandy 11/07/2006]: handle logical inconsistency:
                        // trueCases intersect falseCases != {}
                        break;
                    case trueValue:
                        newState.inferredValue = indeterminateValue;
                        newState.trueCases.addAll(this.trueCases);
                        newState.falseCases.addAll(this.falseCases);
                        break;
                    case falseValue:
                        newState.inferredValue = falseValue;
                        break;
                }
                break;
            case trueValue:
                switch (operand.inferredValue) {
                    case indeterminateValue:
                        newState.inferredValue = indeterminateValue;
                        newState.trueCases.addAll(operand.trueCases);
                        newState.falseCases.addAll(operand.falseCases);
                        break;
                    case trueValue:
                        newState.inferredValue = trueValue;
                        break;
                    case falseValue:
                        newState.inferredValue = falseValue;
                        break;
                }
                break;
            case falseValue:
                newState.inferredValue = falseValue;
                break;
        }
        return newState;
    }
    
    public ConditionalState not() {
        ConditionalState newState = new ConditionalState(falseValue, this.exclusiveOptions, this.independentOptions);
        switch (this.inferredValue) {
            case indeterminateValue:
                newState.inferredValue = indeterminateValue;
                newState.trueCases.addAll(this.falseCases);
                newState.falseCases.addAll(this.trueCases);
                break;
            case trueValue:
                newState.inferredValue = falseValue;
                break;
            case falseValue:
                newState.inferredValue = trueValue;
                break;
        }
        return newState;
    }
    
    public void describeExclusiveConditions(Set includeSet) {
        if (this.inferredValue == indeterminateValue) {
            if (this.trueCases.isEmpty()) {
                includeSet.addAll(this.exclusiveOptions);
                includeSet.removeAll(this.falseCases);
            } else {
                includeSet.addAll(this.exclusiveOptions);
                includeSet.retainAll(this.trueCases);
            }
        }
    }
    
    public void describeIndependentConditions(Set includeSet, Set excludeSet) {
        if (this.inferredValue == indeterminateValue) {
            includeSet.addAll(this.independentOptions);
            includeSet.retainAll(this.trueCases);
            excludeSet.addAll(this.independentOptions);
            excludeSet.retainAll(this.falseCases);
        }
    }
    
    public String toString () {
        if (this.inferredValue == indeterminateValue) {
            List stateElements = new ArrayList();
            
            Set includes = new HashSet();
            Set excludes = new HashSet();
            
            this.describeExclusiveConditions(includes);
            
            Iterator iter;
            for (iter = includes.iterator(); iter.hasNext();)
                stateElements.add("+" + (String) iter.next());
                
            includes.clear();

            this.describeIndependentConditions(includes, excludes);
            
            for (iter = includes.iterator(); iter.hasNext();)
                stateElements.add("+" + (String) iter.next());
                
            for (iter = excludes.iterator(); iter.hasNext();)
                stateElements.add("-" + (String) iter.next());
            
            Collections.sort(stateElements);
            
            String s = "";
            for (iter = stateElements.iterator(); iter.hasNext();) {
                s += (String) iter.next();
            }
            
            return s;
            
        } else
            return (this.inferredValue == trueValue) ? "true" : "false";
    }
}
