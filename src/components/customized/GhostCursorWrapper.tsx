"use client";

import React from "react";
import { ghostCursor } from "cursor-effects";

const GhostCursorWrapper = () => {
    React.useEffect(() => {
        const cursor = ghostCursor();
        return () => {
            cursor.destroy();
        };
    }, []);

    return null;
};

export default GhostCursorWrapper;
