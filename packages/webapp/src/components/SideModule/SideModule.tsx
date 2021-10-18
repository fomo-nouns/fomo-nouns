import React from "react";

const SideModule: React.FC<{content: string}> = props => {
    const { content } = props;

    return(
        <div>
            {content}
        </div>
    )
};

export default SideModule;