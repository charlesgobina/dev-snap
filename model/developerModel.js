import joi from 'joi';

class DeveloperModel {
    constructor(
      email,
      password,
      companyName
    ) {
        this.email = email;
        this.password = password;
        this.companyName = companyName;
    }

    toJSON() {
        return {
            email: this.email,
            password: this.password,
            companyName: this.companyName
        };
    }

    static get developerSchema() {
        return joi.object({
            email: joi.string().required(),
            password: joi.string().required(),
            companyName: joi.string()
        });
    }

    static get updateDeveloperSchema() {
        return joi.object({
            email: joi.string(),
            password: joi.string(),
            companyName: joi.string()
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