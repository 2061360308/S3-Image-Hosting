export class ImageTypeError extends Error {
  constructor(message: string = "Invalid Image Type") {
    super(message);
    this.name = "ImageTypeError";
  }
}

export class ImageAlreadyExistsError extends Error {
  constructor(message: string = "Image Already Exists") {
    super(message);
    this.name = "ImageAlreadyExistsError";
  }
}

export class ImageNotFoundError extends Error {
  constructor(message: string = "Image Not Found") {
    super(message);
    this.name = "ImageNotFoundError";
  }
}

export class TagsOverflowError extends Error {
  constructor(message: string = "Tags array cannot exceed 50 items") {
    super(message);
    this.name = "TagsOverflowError";
  }
}

export class TagNameOverflowError extends Error {
  constructor(message: string = "Tag name cannot exceed 8 characters") {
    super(message);
    this.name = "TagNameOverflowError";
  }
}

export class AlbumNameOverflowError extends Error {
  constructor(message: string = "Album name cannot exceed 20 characters") {
    super(message);
    this.name = "AlbumNameOverflowError";
  }
}

export class NameAlreadyExistsError extends Error {
  constructor(message: string = "Album/Tags name already exists") {
    super(message);
    this.name = "NameAlreadyExistsError";
  }
}

export class InvalidNameError extends Error {
  constructor(message: string = "Invalid Album/Tags Name") {
    super(message);
    this.name = "InvalidNameError";
  }
}
