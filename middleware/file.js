const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'images'); //(err, path to folder)
    },//куда пихать фаил
    filename(req, file, callback) {
        callback(null, new Date().toISOString() + '-' + file.originalname)
    }//говорим как назвать новый фаил 
});// куда и как сохранять файлы, принимает объект где будут фукнции которые будут вызваны в процессе того как фаил будет загружаться

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, callback) => {
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};//валидатор для файлов

module.exports = multer({
    storage,
    fileFilter
});