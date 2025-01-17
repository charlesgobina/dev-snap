import { v4 as uuidv4 } from "uuid";
import Joi from "joi";

class SnapModel {
  constructor({
    userId="",
    snapName,
    createdAt=new Date().toISOString(),
    workspaceArchive="",
    dependencyInfo={},
    configFiles={},
    frameTime="",
    snapSize=0,
    isLocked=false
  }) {
    this.userId = userId;
    this.snapName = snapName;
    this.createdAt = createdAt;
    this.workspaceArchive = workspaceArchive;
    this.dependencyInfo = dependencyInfo;
    this.configFiles = configFiles;
    this.frameTime = frameTime
    this.snapSize = snapSize;
    this.isLocked = isLocked;
  }

  toJSON() {
    return {
      userId: this.userId,
      snapName: this.snapName,
      createdAt: this.createdAt,
      workspaceArchive: this.workspaceArchive,
      dependencyInfo: this.dependencyInfo,
      configFiles: this.configFiles,
      frameTime: this.frameTime,
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
      frameTime: Joi.object().required(),
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
      frameTime: Joi.string(),
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

export default SnapModel;