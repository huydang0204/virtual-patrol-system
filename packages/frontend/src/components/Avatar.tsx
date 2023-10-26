import React, {
  memo,
  useRef,
  useState
} from "react";
import {
  FileError,
  uploadImage
} from "services/file";
import LoadingSpinner from "./LoadingSpinner";

type AvatarType = {
  id : string,
  avatarUrl : string,
  uploadCallback? : (fileUrl : string) => void,
  imageOnly? : boolean,
  invalid? : boolean
}

function Avatar(props : AvatarType) : JSX.Element {
  const {
    id,
    avatarUrl,
    uploadCallback,
    imageOnly,
    invalid
  } = props;
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);
  const [
    imageInvalidText,
    setImageInvalidText
  ] = useState<string>(null);

  const avatarInputRef = useRef(null);

  const onUploadAvatar = async () : Promise<void> => {
    const avatar = avatarInputRef.current?.files[0];
    if (!avatar) return;

    setImageInvalidText(null);
    setLoading(true);
    const {
      data,
      errors
    } = await uploadImage(avatar);
    if (!!errors) {
      let text = null;
      if (errors[FileError.FileRequired]) {
        text = "Image is required!";
      } else if (errors[FileError.FileInvalid]) {
        text = "Image must be a file of type jpeg, jpg, png and smaller than 4Mb!";
      }
      setImageInvalidText(text);
    } else {
      uploadCallback && uploadCallback(data.fileUrl);
    }
    setLoading(false);
  };

  const inputSection = (
    !imageOnly && !!uploadCallback ?
      <input
        type="file"
        accept="image/*"
        ref={ avatarInputRef }
        onChange={ onUploadAvatar }
        style={ { display : "none" } }
        id={ `contained-button-file-${ id }` }
      /> : null
  );

  return (
    <div className={ "avatar big-avatar" }>
      <div>
        <div
          className={ `avatar-img m-0 border border-${ (invalid || imageInvalidText) ? "danger" : "gray" }` }>
          {
            avatarUrl ?
              <img
                className={ `border border-${ (invalid || imageInvalidText) ? "danger" : "gray" }` }
                src={ avatarUrl } />
              : (
                <>
                  <label
                    className="d-block w-100 h-100 d-flex justify-content-center align-items-center"
                    htmlFor={ `contained-button-file-${ id }` }
                    style={ { cursor : imageOnly ? "" : "pointer" } }>
                    { !avatarUrl && <i className="simple-icon-picture text-black-500 image default-avatar-icon" /> }
                    {
                      !imageOnly && <div className="middle">
                        <h5 className="simple-icon-cloud-upload text-primary fw-bolder upload-button" />
                      </div>
                    }
                  </label>
                  { inputSection }
                </>
              )
          }
          { !!imageInvalidText && <div className="pt-1 text-danger text-small">{ imageInvalidText }</div> }
          <LoadingSpinner active={ loading } />
        </div>
        {
          avatarUrl && <div className="mt-2">
            <label
              className="d-block w-100 h-100 d-flex justify-content-center align-items-center"
              htmlFor={ `contained-button-file-${ id }` }
              style={ { cursor : imageOnly ? "" : "pointer" } }>
              {
                !imageOnly && <span className="middle">
                  <span
                    onClick={ onUploadAvatar }
                    className="h5 simple-icon-cloud-upload text-primary fw-bolder upload-button" />
                  <span
                    onClick={ () : void => {
                      uploadCallback && uploadCallback(null);
                    } }
                    className="h5 ms-1 simple-icon-trash text-secondary fw-bolder upload-button" />
                </span>
              }
            </label>
            { inputSection }
          </div> }
      </div>
    </div>
  );
}

export default memo(Avatar);
