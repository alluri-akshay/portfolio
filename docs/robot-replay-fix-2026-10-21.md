# Robot greeting replay

Say hello now cancels any current greeting and scheduled replay, commits the resting pose, and starts one complete wave/expression/bubble sequence on the next frame. The shoulder begins lifting immediately. Automatic greetings resume after a quiet interval. A run counter prevents interrupted greetings from scheduling duplicate timers; offscreen, hidden-tab, and unmount cleanup cancel pending work.

SVG pivots now use Motion's originX/originY with a view-box reference. The previous transformOrigin styles were being replaced by the installed Motion SVG renderer with a 50% fill-box center, so the arm did not rotate around its intended joints.

At the user's explicit request, the robot is independent of the footer page-animation switch: a local MotionConfig uses reducedMotion="never", robot ambient CSS animations override the page-wide static CSS, and pointer tracking opts out of the shared motion preference. The rest of the portfolio still follows the footer switch. The tooltip explains the robot exception. Hidden/offscreen work is still paused to avoid wasted rendering.

Focused verification: TS/TSX syntax parsing, manual/repeated greeting clicks in the browser, and rendered CSS/SVG checks with page motion set to reduced. With page motion off, the enabled button restarted shoulder/elbow/wrist rotation, and float/blink/head/gaze animations were running. No build or full test suite.
