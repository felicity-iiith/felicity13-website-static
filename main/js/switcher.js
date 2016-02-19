$(function(){

    $('#backgrounds img').click(function() {

        var newClass = 'BG' + $(this).attr('id');
        $('body').removeClass().addClass(newClass);

    });

});

function change_frame(parent_frame,child_frame){
    document.getElementById(parent_frame+"_content").innerHTML = document.getElementById(child_frame+"_content").innerHTML;
    document.getElementById(parent_frame+"_tagline").innerHTML = document.getElementById(child_frame+"_tagline").innerHTML;
    document.getElementById(parent_frame+"_header").innerHTML = document.getElementById(child_frame+"_header").innerHTML;
    document.getElementById(parent_frame+"_image").innerHTML = document.getElementById(child_frame+"_image").innerHTML;
}

