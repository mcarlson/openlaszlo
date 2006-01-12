#!/usr/bin/perl
use LWP::Simple;

$|=1;

@fileList=();
open (IN, "all_lzx.txt");
while (<IN>){
    $_ =~ s/\"//g;
    $_ =~ s/,//g; 
    push @fileList,$_;
}
close IN;

#$reqTypes = { 'Wrapper' => 'lzt=v1',
#	    };

foreach $file (@fileList){
    chomp $file;
    $filename = $file;
    $filename =~ s/\//_/g;
    $filename =~ s/\$/D/g;
    print localtime(time).' Storing: new_golden/'.$filename.'_lzt_v1 ... ';
    $returnCode = getstore('http://localhost:8080/lps-dev'.$file.
			   '?lzt=v1','new_golden/'.$filename.'_lzt_v1');

    if ($returnCode == 200 ){
      print "\033[0;32mPASS:\033[0;m Wrapper get of ".$file." completed \n"; 
    } else {
      print "\033[1;31mERROR:\033[0;m wrapper get of ".$file.' returned '.$returnCode."\n\n"; 
    }

    $returnCode = getstore('http://localhost:8080/lps-dev'.$file.
	       '?lzt=swf&lzr=swf6','new_golden/'.$filename.'_lzt_swf6');

    if ($returnCode == 200 ){
      print "\033[0;32mPASS:\033[0;m swf6 get of ".$file." completed \n"; 
    } else {
      print "\033[1;31mERROR:\033[0;m swf6 get of ".$file.' returned '.$returnCode."\n\n"; 
    }

    $returnCode = getstore('http://localhost:8080/lps-dev'.$file.
	       '?lzt=swf&lzr=swf7','new_golden/'.$filename.'_lzt_swf7');
    if ($returnCode == 200 ){
      print "\033[0;32mPASS:\033[0;m swf7 get of ".$file." completed \n"; 
    } else {
      print "\033[1;31mERROR:\033[0;m swf7 get of ".$file.' returned '.$returnCode."\n\n"; 
    }
}
