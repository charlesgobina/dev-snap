import { v4 as uuidv4 } from "uuid";
import Joi from "joi";

class SnapModel {
  constructor() {
    this.userId = uuidv4();
    this.snapName = "";
    this.createdAt = new Date().toISOString();
    this.workspaceArchive = "";
    this.dependencyInfo = {};
    this.configFiles = {};
    this.snapSize = 0;
    this.isLocked = false;
  }

  toJSON() {
    return {
      userId: this.userId,
      snapName: this.snapName,
      createdAt: this.createdAt,
      workspaceArchive: this.workspaceArchive,
      dependencyInfo: this.dependencyInfo,
      configFiles: this.configFiles,
      snapSize: this.snapSize,
      isLocked: this.isLocked,
    };
  }

  static get snapSchema() {
    return Joi.object({
      userId: Joi.string().required(),
      snapName: Joi.string().required(),
      createdAt: Joi.string().required(),
      workspaceArchive: Joi.string().required(),
      dependencyInfo: Joi.object().required(),
      configFiles: Joi.object().required(),
      snapSize: Joi.number().required(),
      isLocked: Joi.boolean().required(),
    });
  }

  static get updateSnapSchema() {
    return Joi.object({
      userId: Joi.string(),
      snapName: Joi.string(),
      createdAt: Joi.string(),
      workspaceArchive: Joi.string(),
      dependencyInfo: Joi.object(),
      configFiles: Joi.object(),
      snapSize: Joi.number(),
      isLocked: Joi.boolean(),
    });
  }

  static validateData(data) {
    return this.snapSchema.validate(data, { abortEarly: false });
  }

  static validateUpdateData(data) {
    return this.updateSnapSchema.validate(data, { abortEarly: false });
  }
}