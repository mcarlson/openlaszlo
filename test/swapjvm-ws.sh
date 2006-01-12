:
# swapjvm-ws.sh
# Provides a sample command line for running swapjvm.pl with IBM WebSphere
# Required: set WEBSPHERE_HOME
# Check that you are using the correct test list .xml file
#
./swapjvm.pl -se-path $WEBSPHERE_HOME -port 9080 -java-home $WEBSPHERE_HOME/java -servlet-engine WebSphere -path lps-dev -- -config all_lzx_tests.xml -swfversion 6
