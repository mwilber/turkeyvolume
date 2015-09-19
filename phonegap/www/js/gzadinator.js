function GZAD_externallink(pURL){
    //'?utm_source=gzad&utm_medium=app&utm_campaign=gzad_banner'
    window.open(pURL,'_system');
}

function GZAD_expand(){
    //alert('expand here');
    $('#banner_group').addClass('expanded');
}

function GZAD_collapse(){
    //alert('expand here');
    $('#banner_group').removeClass('first-run').removeClass('expanded');
}