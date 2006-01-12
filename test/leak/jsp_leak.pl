#!/usr/bin/perl
use LWP::Simple;
use XML::Parser;

$|=1;

@fileList=();
    @dic=('a'..'z','A'..'Z','0'..'9');

open (IN, "all_lzx.txt");
while (<IN>){
    $_ =~ s/\"//g;
    $_ =~ s/,//g; 
    push @fileList,$_;
}
close IN;

#$reqTypes = { 'Wrapper' => 'lzt=v1',
#	    };

$p = new XML::Parser(Handlers => {Start => \&handle_start,
                                            End   => \&handle_end,
                                            Char  => \&handle_char});


foreach $file (@fileList){
    chomp $file;
    $filename = $file;
    $filename =~ s/\//_/g;
    $filename =~ s/\$/D/g;
    #$p->parsefile('..'.$file);
    
    #print localtime(time).' Storing: new_golden/'.$filename.'_lzt_v1 ... ';
    print localtime(time).' working: '.$file;
    
    for (1..33){ 
      open (OUT,'>temp.lzx');
      print OUT '<canvas>';      
      for (1..(100*rand())){
	print OUT '<button>';
	for (1..(100*rand())){
	  print OUT @dic[int($#dic*rand())];
	}
	print OUT '</button>'."\n";
      }
      print OUT '</canvas>'."\n";
      close OUT;

    @request = ('http://localhost:8080/lps-dev/laszlo-explorer/source.jsp?formAction=Update&src=/test/temp.lzx','new_golden/temp');
      if (timeoutGet(@request)==200 ){
	#print "\033[0;32mPASS:\033[0;m Wrapper get of ".$file." completed \n"; 
      } else {
	print "\033[1;31mERROR:\033[0;m wrapper get of ".$file.' returned '.$returnCode."\n\n"; 
      }
    @request = ('http://localhost:8080/lps-dev/test/temp.lzx','new_golden/temp');
      if (timeoutGet(@request)==200 ){
	#print "\033[0;32mPASS:\033[0;m Wrapper get of ".$file." completed \n"; 
      } else {
	print "\033[1;31mERROR:\033[0;m wrapper get of ".$file.' returned '.$returnCode."\n\n"; 
      }

    #@request = ('http://localhost:8080/lps-dev'.$file.'?lzt=v1','new_golden/'.$filename.'_v1');
    @request = ('http://localhost:8080/lps-dev/laszlo-explorer/source.jsp?formAction=Update&src='.$file,'new_golden/'.$filename.'_v1');
    if (timeoutGet(@request) == 200 ){
      #print "\033[0;32mPASS:\033[0;m Wrapper get of ".$file." completed \n"; 
    } else {
      print "\033[1;31mERROR:\033[0;m wrapper get of ".$file.' returned '.$returnCode."\n\n"; 
    }
print '.';

    #@request = ('http://localhost:8080/lps-dev'.$file.'?lzt=swf&lzr=swf6','new_golden/'.$filename.'_swf6');
    @request = ('http://localhost:8080/lps-dev/laszlo-explorer/source.jsp?formAction=Updatesrc='.$file,'new_golden/'.$filename.'_swf6');
    if (timeoutGet(@request) == 200 ){
      #print "\033[0;32mPASS:\033[0;m swf6 get of ".$file." completed \n"; 
    } else {
      print "\033[1;31mERROR:\033[0;m swf6 get of ".$file.' returned '.$returnCode."\n\n"; 
    }
print '.';
    #@request = ('http://localhost:8080/lps-dev'.$file.'?lzt=swf&lzr=swf7','new_golden/'.$filename.'_swf7');
    @request = ('http://localhost:8080/lps-dev/laszlo-explorer/source.jsp?formAction=Updatesrc='.$file,'new_golden/'.$filename.'_swf7');
    if (timeoutGet(@request) == 200 ){
      #print "\033[0;32mPASS:\033[0;m swf7 get of ".$file." completed \n"; 
    } else {
      print "\033[1;31mERROR:\033[0;m swf7 get of ".$file.' returned '.$returnCode."\n\n"; 
    }
print '.';
  }
    print "\n";
}


sub timeoutGet{
  my $returnCode;
  eval {
    local $SIG{ALRM} = sub { die "get timed out" };
    alarm 30;
    $returnCode = getstore(@_[0],@_[1]);
    alarm 0;
  };
  if ($@ and $@ !~ /get timed out/) { die }
  #print $returnCode;
  return $returnCode;
}
sub handle_start {
shift;
print @_;
}
sub handle_end {
shift;
print @_;

}
sub handle_char {
shift;
#print @_;
}
