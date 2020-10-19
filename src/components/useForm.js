import React, { useState } from 'react';

const isFileTypeAuthorized = (file) => {
  const fileTypes = ['image/', 'video/'];
  return fileTypes.some((type) => file.type.startsWith(type));
};

const getFileType = (fileType) => {
  const regex = /^(image|video)/g;
  const found = fileType.match(regex);
  const result = found ? found.shift() : null;
  return result;
};

export function useForm(initialFValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});

  const handleFile = (file) => {
    setErrors({ ...errors, fileType: '' });
    setValues({
      ...values,
      fileName: '',
      fileBuffer: null,
      fileType: null,
    });

    if (isFileTypeAuthorized(file)) {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        setValues({
          ...values,
          fileBuffer: Buffer(reader.result),
          fileName: file.name,
          fileType: getFileType(file.type),
        });
      };
    } else {
      setErrors({ ...errors, fileType: 'Wrong file type!' });
    }
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;

    if (files && files[0]) {
      handleFile(files[0]);
    } else {
      setValues({ ...values, [name]: value });
      if (validateOnChange) {
        validate({ [name]: value });
      }
    }
  };

  const resetForm = () => {
    setValues(initialFValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  };
}

export function Form({ children, ...restProps }) {
  const { onSubmit, noValidate, autoComplete } = restProps;
  return (
    <form
      autoComplete={autoComplete}
      onSubmit={onSubmit}
      noValidate={noValidate}
    >
      {children}
    </form>
  );
}
