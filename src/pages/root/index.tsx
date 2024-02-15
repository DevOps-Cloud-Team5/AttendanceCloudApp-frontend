import React, {FC} from "react";

const Rootpage: FC = (props) => {
    return (
        <>
        {/* <Header /> */}

        {/* Page Content */}
        {props.children}
        {/* End Page Content */}

        {/* <Footer /> */}
        </>
        );

}

export default Rootpage