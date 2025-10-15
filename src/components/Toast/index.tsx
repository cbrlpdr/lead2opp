import { Check, X } from "lucide-react";
import React, { useEffect } from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error";
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = "success", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // fecha sozinho depois de 3s
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

    return (
        <div className={`fixed top-5 right-5 px-4 mt-14 py-2 rounded text-white ${bgColor} shadow-lg flex flex-cols-2`}>
            {type === "success"?<Check className="mr-2" />:<X />}
            {message}
        </div>
    );
};
