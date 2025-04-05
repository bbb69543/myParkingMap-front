const Type = { 1: '平面', 2: '立體', 3: '地下', 4: '立體停車塔', 5: '立體機械式', 6: '同時涵蓋2種以上', 254: '其他', 255: '未知' }
const LiveOccuppancyAvailable = { 0: '否', 1: '是' }
const Toilet = { 0: '否', 1: '是' }
const SpaceType = { 0: '所有停車位類型', 1: '自小客車位', 2: '機車位', 3: '重型機車位', 4: '腳踏車位', 5: '大型車位', 6: '小型巴士位', 7: '孕婦親子專用車位', 8: '婦女車位', 9: '身心障礙汽車車位', 10: '身心障礙機車車位', 11: '電動汽車車位', 12: '電動機車車位', 13: '復康巴士', 14: '月租機車位', 15: '月租汽車位', 16: '季租機車位', 17: '季租汽車位', 18: '半年租機車位', 19: '半年租汽車位', 20: '年租機車位', 21: '年租汽車位', 22: '租賃機車位', 23: '租賃汽車位', 24: '卸貨車位', 25: '計程車位', 26: '夜間安心停車位', 27: '臨時停車', 28: '專用停車', 29: '預約停車', 254: '其他', 255: '未知' }

const iconMap = {
    1: '🚗',
    2: '🛵',
    3: '🏍️',
    4: '🚲',
    5: '🚛',
    6: '🚌',
    7: '👨‍👩‍👧‍👦',
    8: '♀️',
    9: '♿',
    10: '♿',
    11: '🔋',
    12: '🔋',
};



const CarParkData = (props) => {

    const {
        CarParkName,
        Address,
        Telephone,
        CarParkType,
        LiveOccuppancyAvailable,
        Toilet,
        FareDescription,
        AvailableSpaces = [],
    } = props.data;

    return (
        <div className="carpark-card">
            <h2 className="carpark-name">{CarParkName}</h2>
            <div className="carpark-address">{Address}</div>
            <div className="carpark-tel">{Telephone}</div>
            <div className="carpark-type">{Type[CarParkType]}停車場</div>

            <div className="space-grid">
                {AvailableSpaces.map((space, index) => {
                    if (space.SpaceType == null) return null;
                    const icon = iconMap[space.SpaceType] || '🅿️';

                    return (
                        <div key={index} className="space-box">
                            <div className="space-icon">{icon}</div>
                            <div className="space-type">{SpaceType[space.SpaceType]}</div>
                            <div className="space-count">
                                <span className={space.AvailableSpaces ? "available" : "unavailable"}>{space.AvailableSpaces || "無資訊"}</span>
                                <span className="total"> / {space.NumberOfSpaces}</span>
                            </div>
                        </div>
                    );
                })}

                {Toilet ? (
                    <div className="space-box">
                        <div className="space-icon">🚻</div>
                        <div className="space-label">有廁所</div>
                    </div>
                ) : ""}

                {CarParkType ? (
                    <div className="space-box">
                        <div className="space-icon">💡</div>
                        <div className="space-label">{Type[CarParkType]}停車場</div>
                    </div>
                ) : ""}

            </div>
            <div>
                <div className="carpark-price">{FareDescription}</div>

                <div className="carpark-nav">
                    <span className="nav-icon">➡️</span>
                    <span className="nav-text">導航至停車場</span>
                </div>
            </div>


        </div>
    );
};

export default CarParkData;