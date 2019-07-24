Task = require('./taskModel');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(express.json())

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

function createNewTask(body){
    var task = new Task();
    task.user_id = body.user_id;
    task.currency_pair = body.currency_pair;
    task.risk_level = body.risk_level;
    task.start_time = body.start_time;
    task.end_time = body.end_time;
    task. current_return = body.current_return;
    task.max_return = body.max_return ? body.max_return : task.max_return;
    return task;
}

router.get('/user/:user_id', function(req, res) {
    Task.find({user_id:req.params.user_id}, function (err, task) {
        if (err)
            return res.status(400).json({message: err})
        return res.status(200).json({
            message: 'get task successfully',
            data: task
        });
    });
});

router.get('/:task_id', function(req, res) {
    Task.findById(req.params.task_id, function (err, task) {
        if (err)
            return res.status(400).json({message: err})
        return res.status(200).json({
            message: 'get task successfully',
            data: task
        });
    });
});

// router.put('/', function(req, res) {
//     // console.log(req);
//     var task = createNewTask(req.body);

//     task.save(function (err) {
//         if (err)
//             // res.status(400).json({message: 'エラー'})
//             return res.status(400).json({message: 'エラー! ' + err})
//             // return res.status(400).json({エラー: err})
//         return res.status(200).json({
//             message: 'create task successfully.',
//             task
//         });
//     });
// });

router.post('/', function(req, res) {

    var task = createNewTask(req.body);

    task.save(function (err) {
        if (err)
            return res.status(400).json({message: err})
        return res.status(200).json({
            message: 'create task successfully.',
            task
        });
    });
});

router.patch('/:task_id', function(req, res) {

    Task.findById(req.params.task_id, function (err, task) {
        if (err)
            return res.status(400).json({message: err})
        task.set(req.body);
        task.save(function (err) {
            if (err)
                return res.status(400).json({message: err})
            return res.status(200).json({
                message: 'update task successfully.',
                task
            });
        });
    });
});

router.delete('/:task_id', function(req, res) {
    Task.deleteOne({_id:req.params.task_id}, function (err) {
        if (err)
            return res.status(400).json({message: err})
        return res.status(200).json({
            message: 'delete task successfully.'
        });
    });
});

module.exports = router;














// // Handle index actions
// exports.index = function (req, res) {
//     Contact.get(function (err, contacts) {
//         if (err) {
//             res.json({
//                 status: "error",
//                 message: err,
//             });
//         }
//         res.json({
//             status: "success",
//             message: "Contacts retrieved successfully",
//             data: contacts
//         });
//     });
// };
// // Handle create contact actions
// exports.new = function (req, res) {
//     var contact = new Contact();
//     contact.name = req.body.name ? req.body.name : contact.name;
//     contact.gender = req.body.gender;
//     contact.email = req.body.email;
//     contact.phone = req.body.phone;
// // save the contact and check for errors
//     contact.save(function (err) {
//         // if (err)
//         //     res.json(err);
// res.json({
//             message: 'New contact created!',
//             data: contact
//         });
//     });
// };
// // Handle view contact info
// exports.view = function (req, res) {
//     Contact.findById(req.params.contact_id, function (err, contact) {
//         if (err)
//             res.send(err);
//         res.json({
//             message: 'Contact details loading..',
//             data: contact
//         });
//     });
// };
// // Handle update contact info
// exports.update = function (req, res) {
// Contact.findById(req.params.contact_id, function (err, contact) {
//         if (err)
//             res.send(err);
// contact.name = req.body.name ? req.body.name : contact.name;
//         contact.gender = req.body.gender;
//         contact.email = req.body.email;
//         contact.phone = req.body.phone;
// // save the contact and check for errors
//         contact.save(function (err) {
//             if (err)
//                 res.json(err);
//             res.json({
//                 message: 'Contact Info updated',
//                 data: contact
//             });
//         });
//     });
// };
// // Handle delete contact
// exports.delete = function (req, res) {
//     Contact.remove({
//         _id: req.params.contact_id
//     }, function (err, contact) {
//         if (err)
//             res.send(err);
// res.json({
//             status: "success",
//             message: 'Contact deleted'
//         });
//     });
// };