import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons"

export default ({ svgClassName, buttonClassName, isNavVisible, toggleNav }) => {
    return (
        <button className={`${buttonClassName
        } z-50`} onClick={toggleNav}>
            {!isNavVisible && (
                <svg data-component="Icon" className={`fill-current text-white h-8 w-8 ${svgClassName}`} viewBox="0 0 24 24" role="presentation" focusable="false" height="24" width="24">
                    <g>
                        <path d="M14.805 14.434a3.8079 3.8079 0 0 1-3.765-3.8593c-.03454-1.36777.67542-2.64668 1.85452-3.34073 1.1791-.69405 2.64186-.69405 3.82096 0S18.60454 9.20693 18.57 10.5747a3.8079 3.8079 0 0 1-3.765 3.8593zm5.02 0h-.661l-.2343-.2316a5.6321 5.6321 0 0 0 1.3136-3.6278c.04865-1.97487-.97712-3.82091-2.67976-4.82266-1.70265-1.00175-3.81453-1.00175-5.51718 0-1.70264 1.00175-2.72841 2.84779-2.67976 4.82266-.03723 3.04097 2.39734 5.53656 5.4383 5.5746a5.3374 5.3374 0 0 0 3.5391-1.3465l.2259.24v.6773L22.7532 20 24 18.7221l-4.175-4.2881zM10.227 5H1v1.7153h7.78A7.269 7.269 0 0 1 10.227 5zm-.8388 10.2916H1v1.7153h10.46a7.1728 7.1728 0 0 1-2.0718-1.7153zm-1.6949-4.717c0-.1448.013-.2861.0211-.4288H1v1.7153h6.8106a7.488 7.488 0 0 1-.1173-1.2865z">
                        </path>
                    </g>
                </svg>
            )}
            {isNavVisible && <FontAwesomeIcon size="2x" icon={faTimesCircle} color="white" />}
        </button>
    )
}
