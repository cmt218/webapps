$(document).ready(function(){
    console.log("ready");
    $("body").append("<ul>");
    $("body").append("<li> html </li>");
    visitTag("html");
    $("body").append("</ul>");
});

 var opened;
 
function visitTag(element) {
   
    
    $(element).children().each(function(index, item) {
        if($(element).contents().length > 1 && index === 0 && !opened){
            opened = true;
            $("body").append("<ul>");
        }
        
        var thisBullet = "<li>";
        var source = $(item).attr('src');
        var tagType = $(item).attr('type');
        var tagText = $(item).text();
        var link = $(item).attr('href');
        var ident = $(item).attr('id');
        var rel = $(item).attr('rel');
        thisBullet += item.nodeName.toLowerCase();
        if(item.nodeName === 'LI' || item.nodeName === 'H1'){
            thisBullet += " text: " + tagText; 
        }
        if(source){
            thisBullet += " src: " + source;
        }
        if(tagType){
            thisBullet += " type: " + tagType;
        }
        if(link){
            thisBullet += " href: " + link;
        }
        if(ident){
            thisBullet += " id: " + ident;
        }
        if(rel){
            thisBullet += " rel: " + rel;
        }
        $("body").append(thisBullet);
        $("body").append("</li>");
        visitTag(item);
    
    });
    if(opened){
            opened = false;
            $("body").append("</ul>");
    }
    
}