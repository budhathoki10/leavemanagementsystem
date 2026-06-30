const user = require('../models/module.models');
const errorHandler = require('../validations/errorHanlder');
const createModules = async (req, res) => {
  try {
    let { Modulename, Moduleleader, Moduleid } = req.body;
    // check if module is present or not
    let check = await user.findOne({ $or: [{ Modulename }, { Moduleid }] });
    if (check) {
      return res
        .status(400)
        .json(
          new errorHandler(
            false,
            400,
            'Error processing request',
            'this module is already present',
            null,
          ),
        );
    }
    let newmodules = new user({
      Modulename,
      Moduleid,
      Moduleleader,
    });
    const saved = await newmodules.save();
    res
      .status(200)
      .json(new errorHandler(true, 200, 'Request processed successfully', null, saved));
  } catch (error) {
    res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request', error.message, null));
  }
};

const readModules = async (req, res) => {
  try {
    // retrive all the modules from database
    const modules = await user.find();
    // if database is empty
    if (modules.length === 0) {
      return res
        .status(404)
        .json(
          new errorHandler(false, 404, 'Error processing request', 'no modules in database', null),
        );
    }
    return res
      .status(200)
      .json(new errorHandler(true, 200, 'Request processed successfully', null, modules));
  } catch (error) {
    return res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request', error.message, null));
  }
};

const updateModules = async (req, res) => {
  try {
    // get the id from url
    const id = req.params.id;
    // // cehcking if id is present or not
    const updates = await user.findByIdAndUpdate(id, req.body, { new: true });
    if (!updates) {
      return res
        .status(404)
        .json(
          new errorHandler(
            false,
            404,
            'Error processing request',
            'cannot find this id in database',
            null,
          ),
        );
    }
    res
      .status(200)
      .json(new errorHandler(true, 200, 'Request processed successfully', null, updates));
  } catch (error) {
    return res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request', error.message, null));
  }
};

const deleteModules = async (req, res) => {
  try {
    // get the id from url
    const id = req.params.id;

    const up = await user.findByIdAndDelete(id, req.body, { new: true });
    if (!up) {
      return res
        .status(404)
        .json(
          new errorHandler(
            false,
            404,
            'Error processing request',
            `no module found with id: ${id}`,
            null,
          ),
        );
    }

    res.status(200).json(new errorHandler(true, 200, 'Request processed successfully', null, up));
  } catch (error) {
    return res
      .status(500)
      .json(new errorHandler(false, 500, 'Error processing request', error.message, null));
  }
};

module.exports = { createModules, readModules, updateModules, deleteModules };
