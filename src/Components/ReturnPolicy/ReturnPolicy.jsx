import React, { useEffect } from "react";
import { X } from "lucide-react";

const ReturnPolicy = ({ onClose }) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="return-policy-overlay"
            onMouseDown={handleOverlayClick}
        >
            <div
                className="return-policy-modal"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="return-policy-header">
                    <h2>Return Policy</h2>

                    <button
                        type="button"
                        className="return-policy-close"
                        onClick={onClose}
                        aria-label="Close return policy"
                    >
                        <X size={22} strokeWidth={1.8} />
                    </button>
                </div>

                <div className="return-policy-content">
                    <section>
                        <h3>Return Policy</h3>

                        <p>
                            Returns are accepted only in case of a manufacturing
                            defect, damage or product received in a torn condition.
                        </p>

                        <p>
                            For any damage/defect claim, please record a complete
                            unboxing video before opening the package.
                        </p>

                        <p>
                            Claims without an unboxing video may not be accepted.
                        </p>
                    </section>

                    <section>
                        <h3>Important</h3>

                        <ul>
                            <li>
                                Record a complete unboxing video before opening
                                the package.
                            </li>

                            <li>
                                The video should clearly show the package and the
                                product condition.
                            </li>

                            <li>
                                Damage or defect claims may require the unboxing
                                video as proof.
                            </li>

                            <li>
                                Returns are applicable only for eligible damage
                                or manufacturing defects.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3>Return Eligibility</h3>

                        <p>
                            If your product arrives damaged, defective or in a
                            torn condition, please contact us as soon as possible
                            with the required unboxing video.
                        </p>
                    </section>

                    <section>
                        <h3>Conditions for Return</h3>

                        <ul>
                            <li>
                                The product must be unused.
                            </li>

                            <li>
                                The product must be returned in its original
                                packaging.
                            </li>

                            <li>
                                Product tags and labels should remain attached.
                            </li>

                            <li>
                                A valid unboxing video may be required for
                                damage or defect claims.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3>How to Request a Return</h3>

                        <p>
                            Contact our customer support as soon as possible
                            after receiving the product and provide your order
                            details along with the required photographs or
                            unboxing video.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;