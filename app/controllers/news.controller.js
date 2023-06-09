const NewsService = require("../services/news.service");
const MongoDB = require("../utils/mongodb.utils");
const ApiError = require("../api-error");
const { response } = require("express");

exports.create = async (req, res, next) => {
    if (!req.body?.title) {
        return next(new ApiError(400, "Name can not be empty"));
        // return res.send(req.body);
    }

    try {
        const newsService = new NewsService(MongoDB.client);
        const document = await newsService.create(req.body);
        return res.send(document);
    }
    catch (error) {
        return next (
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const newsService = new NewsService(MongoDB.client);
        documents = await newsService.find({})
    } catch (error) {
        return next (
            new ApiError(500, "An error occurred while retrieving contacts")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: " Contact was updated successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Error updateing contact with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete contact with id=${req.params.id}`
            )
        );
    }
}

exports.deleteAll = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfulle`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
};