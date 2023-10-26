interface AlertTypeResponse {
  id : string;
  type : string;
  priority : string;
  description : string;
  actionTaken : string[];
  imageUrl : string;
  deletedAt ?: string
}

enum AlertTypeError {
  DuplicatedType = "DuplicatedType",
  NotFound = "NotFound"
}

export {
  AlertTypeResponse,
  AlertTypeError
};
