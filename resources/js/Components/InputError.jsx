import React from 'react';
import PropTypes from 'prop-types';

export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={'text-sm text-red-600 ' + className}>
            {message}
        </p>
    ) : null;
}

InputError.propTypes = {
    message: PropTypes.string.isRequired,
    className: PropTypes.string,
};