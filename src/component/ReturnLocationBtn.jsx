import btnIcon from "/icons/focus.png";

const ReturnLocationBtn = (props) => {
    return (
        <button
            id="returnLocationBtn"
            onClick={props.handleReturnToLocation}
        >
            <img src={btnIcon} style={{ width: "100%", height: "100%" }}></img>
        </button>
    );
};

export default ReturnLocationBtn;