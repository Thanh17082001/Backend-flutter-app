const ProductService = require("../services/product.service");
const MongoDB = require("../utils/mongodb.utils");
const ApiError = require("../api-error");
const { response } = require("express");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
        // return res.send(req.body);
    }

    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.create(req.body);
        return res.send(document);
    }
    catch (error) {
        return next (
            new ApiError(500, "An error occurred while creating the product")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const productService = new ProductService(MongoDB.client);
        documents = await productService.find({})
    } catch (error) {
        return next (
            new ApiError(500, "An error occurred while retrieving products")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "product not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving product with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if(!req.params) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "product not found"));
        }
        return res.send(req.body);
    } catch (error) {
        return next(
            new ApiError(500, `Error updateing product with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send({message: "Product was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete product with id=${req.params.id}`
            )
        );
    }
}

exports.deleteAll = async (_req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const deletedCount = await productService.deleteAll();
        return res.send({
            message: `${deletedCount} products were deleted successfulle`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all products")
        );
    }
};