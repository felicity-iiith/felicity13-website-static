function getkey(e){
if(e.keyCode==13){
$('.uibutton').show(300);
    get_answer();
}
}

function hide_answer(){
    var answer_box = document.getElementById("answer");
    //answer_box.hide();
    answer_box.innerHTML = "<p>Hey, ask me a question!</p>";
}


function get_answer(){
    question_box = document.getElementById("question_box");
    question = encodeURIComponent(question_box.value);
    //question = question_box.value;
    
$.ajax({type:'GET',url:'http://10.4.3.65/web2py/ChatBot_V4/default/get_answer',success:function(temp){ 
		    if(temp) { document.getElementById("answer").innerHTML = temp;} 
		    else alert("booo"+temp);},
		    data:question});
/**	
	$.post("http://felicity.iiit.ac.in/web2py/ChatBot_V4/default/get_answer", {Q:question}, function(temp){
		    if(temp) { document.getElementById("answer").innerHTML = temp;} 
		    else alert("booo"+temp);
	});
**/
}

function change_frame(parent_frame,child_frame){
    document.getElementById(parent_frame+"_content").innerHTML = document.getElementById(child_frame+"_content").innerHTML;
    document.getElementById(parent_frame+"_tagline").innerHTML = document.getElementById(child_frame+"_tagline").innerHTML;
    document.getElementById(parent_frame+"_header").innerHTML = document.getElementById(child_frame+"_header").innerHTML;
    document.getElementById(parent_frame+"_image").innerHTML = document.getElementById(child_frame+"_image").innerHTML;
}
