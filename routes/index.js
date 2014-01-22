
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.send("test")
//  res.render('index', { title: 'Mike Chat' });
};

exports.show = function(req, res, slug) {
  res.send("test")
//  res.render('show', {title: "Chat Room" + slug});
}