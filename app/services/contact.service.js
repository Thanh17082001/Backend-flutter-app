const {ObjectId} = require("mongodb");

class ContactService {
    constructor(client) {
        this.contact = client.db().collection("products");
    }

    extracConactData(payload) {
        const contact = {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            image: payload.image,
        };

        return contact;
    }

    async create(payload) {
        const contact = this.extracConactData(payload);
        const result = await this.contact.findOneAndUpdate(
            contact,
            {$set: {}},
            {returnDocument: "after", upsert: true}
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findbyName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i"},
        });
    }

    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extracConactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            {$set: update},
            {returnDocument: "after"}
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Contact.fineOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = ContactService;