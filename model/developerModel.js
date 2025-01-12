import joi from 'joi';

class DeveloperModel {
    constructor(
      id,
      email,
      password,
      companyName,
      isDevReady=false

    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.companyName = companyName;
        this.isDevReady = isDevReady;

    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            password: this.password,
            companyName: this.companyName,
            isDevReady: this.isDevReady
        };
    }

    static get developerSchema() {
        return joi.object({
            id: joi.string(),
            email: joi.string().required(),
            password: joi.string().required(),
            companyName: joi.string(),
            isDevReady: joi.boolean()

        });
    }

    static get updateDeveloperSchema() {
        return joi.object({
            id: joi.string(),
            email: joi.string(),
            password: joi.string(),
            companyName: joi.string(),
            isDevReady: joi.boolean()
        });
    }

    static validateData(data) {
        return this.developerSchema.validate(data, { abortEarly: false });
    }

    static validateUpdateData(data) {
        return this.updateDeveloperSchema.validate(data, { abortEarly: false });
    }
}

export default DeveloperModel;