#!/bin/sh
# $Revision$ $Change$ $DateTime$
#===============================================================================
# Scrutinize lzx, java, jsp, and html/htm files for correct copyright, hard 
# tabs and TODO/XXX.
#
# Input environment variables:
#
#    FILES          : files to check (shell wildcards work)
#    DIRS           : directories to recursively check
#    EXCLUDE        : paths/files to exclude (wildcards work)
#    SRC_COPYRIGHT  : copyright string to src check files with (optional)
#    HTML_COPYRIGHT : copyright string to htm{,l} check files with (optional)
#    VERBOSE        : 0|1, verbose mode prints lines w/ numbers (default: 0)
#
# Author: pkang@laszlosystems.com
#===============================================================================

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

FIND=/bin/find
EGREP=/bin/egrep
ECHO=/bin/echo

if [ "${VERBOSE}" = "" ]; then
    VERBOSE=0
elif [ "${VERBOSE}" != 0 ]; then
    VERBOSE=1
fi


for file in ${FILES}; do
    if [ ! -f ${file} ]; then
        ${ECHO} "Warning: ${file} is not a file"
    else
        _FILES="${_FILES} ${file}"
    fi
done

for dir in ${DIRS}; do
    if [ ! -d ${dir} ]; then
        ${ECHO} "Warning: ${dir} is not a directory"
    else
        _DIRS="${_DIRS} ${dir}"
    fi
done

if [ "${_DIRS}" = "" ]; then
    if [ "${_FILES}" = "" ]; then
        ${ECHO} "No files to check"
        exit 1
    fi
fi

if [ "${SRC_COPYRIGHT}" = "" ]; then
    if [ "${VERBOSE}" = 1 ]; then
        ${ECHO} "Warning: SRC_COPYRIGHT undefined"
    fi
fi

if [ "${HTML_COPYRIGHT}" = "" ]; then
    if [ "${VERBOSE}" = 1 ]; then
        ${ECHO} "Warning: HTML_COPYRIGHT undefined"
    fi
fi

if [ "${EXCLUDE}" != "" ]; then
    for dir in ${EXCLUDE}; do
        echo $dir
        PRUNE="${PRUNE} -o -path ${dir} -prune -a -name ${dir} -prune"
    done
fi


showproblem()
{
    if [ "${DISPFILE}" = 0 ]; then
        ${ECHO} "${FILE}"
        DISPFILE=1
    fi

    ${ECHO} "    ${HEADER}"

    if [ "${VERBOSE}" = 1 ]; then
        if [ "${PROBLEM}" != "" ]; then
            ${ECHO} "${PROBLEM}"
        fi
    fi

    STATUS=1
}


if [ "${VERBOSE}" = 1 ]; then
    FLAG=-n
    VAL=""
else
    FLAG=-c
    VAL=0
fi

SRCLIST=`${FIND} ${_DIRS} -name '*.lzx' -o -name '*.java' -o \
    -name '*.jsp' ${PRUNE}`

HTMLLIST=`${FIND} ${_DIRS} -name '*.html' -o -name '*.htm' ${PRUNE}`

STATUS=0

for FILE in ${_FILES} ${SRCLIST}; do
    
    DISPFILE=0

    if [ -d "${FILE}" ] ; then
        continue
    fi

    if [ "${SRC_COPYRIGHT}" != "" ]; then
        PROBLEM=`${EGREP} ${FLAG} "${SRC_COPYRIGHT}" ${FILE}`
        if [ "${PROBLEM}" = "${VAL}" ]; then
            HEADER="Missing/non-standard src copyright"
            showproblem
        fi
    fi

    PROBLEM=`${EGREP} ${FLAG} "	" ${FILE}`
    if [ "${PROBLEM}" != "${VAL}" ]; then
        HEADER="Has hard tabs"
        showproblem
    fi

    PROBLEM=`${EGREP} -i ${FLAG} "TODO|XXX" ${FILE}`
    if [  "${PROBLEM}" != "${VAL}" ]; then
        HEADER="Has TODO/XXX"
        showproblem
    fi

done

for FILE in ${HTMLLIST}; do
    
    DISPFILE=0

    if [ -d "${FILE}" ] ; then
        continue
    fi


    if [ "${HTML_COPYRIGHT}" != "" ]; then
        PROBLEM=`${EGREP} ${FLAG} "${HTML_COPYRIGHT}" ${FILE}`
        if [ "${PROBLEM}" = "${VAL}" ]; then
            HEADER="Missing/non-standard html copyright"
            showproblem
        fi
    fi

    PROBLEM=`${EGREP} ${FLAG} "	" ${FILE}`
    if [ "${PROBLEM}" != "${VAL}" ]; then
        HEADER="Has hard tabs"
        showproblem
    fi

    PROBLEM=`${EGREP} -i ${FLAG} "TODO|XXX" ${FILE}`
    if [  "${PROBLEM}" != "${VAL}" ]; then
        HEADER="Has TODO/XXX"
        showproblem
    fi

done

exit ${STATUS}
