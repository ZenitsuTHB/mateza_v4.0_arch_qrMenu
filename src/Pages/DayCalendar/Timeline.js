import { FaGripHorizontal, FaThumbtack, FaRedo } from 'react-icons/fa';

const Timeline = ({ timeBlocks, zoomLevel, onTimeBlockClick, onTimeBlockMove }) => {
  const [hiddenBefore, setHiddenBefore] = useState(null);
  const scrollableRef = useRef(null);

  const hourHeight = 60 * zoomLevel;
  const { hourInterval, snappingIntervalMinutes, hours } = useTimelineSettings(zoomLevel);
  const [blockPositions, setBlockPositions] = useBlockPositions(timeBlocks, hourHeight);
  const pixelOffset = hiddenBefore !== null ? hiddenBefore * hourHeight : 0;
  const getPixelOffset = () => pixelOffset;

  const { dragging, handleDragStart, handleDrag, handleDragStop } = useDragHandlers(
    hourHeight,
    snappingIntervalMinutes,
    onTimeBlockMove,
    getPixelOffset
  );

  const containerHeight = hiddenBefore !== null
    ? (24 - hiddenBefore) * hourHeight
    : 24 * hourHeight;

  useEffect(() => {
    const storedHiddenBefore = localStorage.getItem('hiddenBefore');
    if (storedHiddenBefore !== null) {
      const parsedHiddenBefore = parseInt(storedHiddenBefore, 10);
      if (!isNaN(parsedHiddenBefore) && parsedHiddenBefore >= 0 && parsedHiddenBefore < 24) {
        setHiddenBefore(parsedHiddenBefore);
      }
    }
  }, []);

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = 0;
    }
  }, [hiddenBefore, hourHeight]);

  const handleClick = (block, event) => {
    if (dragging) {
      event.stopPropagation();
      return;
    }
    onTimeBlockClick(block);
  };

  const handleEyeClick = (hour, event) => {
    event.stopPropagation();
    if (hiddenBefore === hour) {
      setHiddenBefore(null);
      localStorage.removeItem('hiddenBefore');
      console.log(`Showing all times again`);
    } else {
      setHiddenBefore(hour);
      localStorage.setItem('hiddenBefore', hour);
      console.log(`Hiding times before hour: ${hour}`);
    }
  };

  const filteredHours = hiddenBefore !== null
    ? hours.filter(hour => hour >= hiddenBefore)
    : hours;

  const filteredTimeBlocks = hiddenBefore !== null
    ? timeBlocks.filter(block => parseTime(block.startTime) >= hiddenBefore)
    : timeBlocks;

  return (
    <div className="timeline">
      <div className="timeline-scrollable" ref={scrollableRef}>
        <div className="timeline-container" style={{ height: `${containerHeight}px` }}>
          {filteredHours.map((hour, index) => (
            <div
              key={index}
              className="timeline-hour"
              style={{
                top: `${(hour - (hiddenBefore || 0)) * hourHeight}px`,
                height: `${hourHeight * hourInterval}px`,
              }}
            >
              <div className="hour-label">
                <FaThumbtack
                  className={`hour-eye ${hiddenBefore === hour ? 'active' : ''}`}
                  onClick={(e) => handleEyeClick(hour, e)}
                />
                <span className="hour-label-span">
                  {`${String(Math.floor(hour)).padStart(2, '0')}:${
                    hour % 1 === 0.5
                      ? '30'
                      : hour % 1 === 0.25
                      ? '15'
                      : hour % 1 === 0.75
                      ? '45'
                      : '00'
                  }`}
                </span>
              </div>
              <div className="hour-line"></div>
            </div>
          ))}
          {filteredTimeBlocks.map((block) => {
            const position = blockPositions[block._id] || { x: 0, y: 0 };
            const adjustedY = hiddenBefore !== null
              ? position.y - pixelOffset
              : position.y;

            const adjustedPosition = { x: position.x, y: adjustedY };

            const blockDurationMinutes =
              parseTime(block.endTime) - parseTime(block.startTime);
            const blockHeight = (blockDurationMinutes / 60) * hourHeight;

            return (
              <Draggable
                axis="y"
                bounds="parent"
                onStart={handleDragStart}
                onDrag={(e, data) => handleDrag(e, data, block, setBlockPositions)}
                onStop={(e, data) => handleDragStop(e, data, block, setBlockPositions)}
                key={block._id + block.startTime + block.endTime}
                position={adjustedPosition}
                handle=".grip-handle"
              >
                <div
                  className="time-block"
                  style={{
                    height: `${blockHeight}px`,
                    backgroundColor: block.kleurInstelling,
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  onClick={(event) => handleClick(block, event)}
                >
                  <div className="time-block-title">
                    {block.title}{' '}
                    <span className="time-block-time">
                      {`${block.startTime} - ${block.endTime}`}
                    </span>
                    {block.dayOfWeekBlock && (
                      <FaRedo
                        style={{
                          opacity: 0.5,
                          color: 'white',
                          marginLeft: '5px',
                          verticalAlign: 'middle',
                        }}
                      />
                    )}
                  </div>
                  <div className="grip-handle">
                    <FaGripHorizontal />
                  </div>
                </div>
              </Draggable>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
