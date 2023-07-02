

// import React, { useState, useEffect } from 'react';
// import Setup from './Setup';

// const Profile = () => {
//   const [activePanel, setActivePanel] = useState(null);

//   useEffect(() => {
//     const storedPanel = localStorage.getItem('activePanel');
//     if (storedPanel) {
//       setActivePanel(storedPanel);
//     }
//   }, []);

//   const handleClick = (panelName) => {
//     setActivePanel(panelName);
//     localStorage.setItem('activePanel', panelName);
//   };

//   return (
//     <div>
//       <div>
//         <button onClick={() => handleClick('description')}>Description</button>
//         <button onClick={() => handleClick('setup')}>Setup</button>
//       </div>

//       {activePanel === 'description' && <DescriptionComponent />}
//       {activePanel === 'setup' && <Setup />}
//     </div>
//   );
// };

// const DescriptionComponent = () => {
//   return (
//     <div>
//       <h2>Description Component</h2>
//       {/* Your description component code here */}
//     </div>
//   );
// };

// const SetupComponent = () => {
//   return (
//     <div>
//       <h2>Setup Component</h2>
//       {/* Your setup component code here */}
//     </div>
//   );
// };

// export default Profile;
import React, { useState, useEffect } from 'react';
import "../styles/profile.css"
import Setup from './Setup';
import DescriptionComponent from './DescriptionComponent';
const Profile = () => {
  const [activePanel, setActivePanel] = useState(null);

  useEffect(() => {
    const storedPanel = localStorage.getItem('activePanel');
    if (storedPanel) {
      setActivePanel(storedPanel);
    }
  }, []);

  const handleClick = (panelName) => {
    setActivePanel(panelName);
    localStorage.setItem('activePanel', panelName);
  };

  return (
    <div className="profile-container">
      <div className="side-panel">
        <button
          className={activePanel === 'description' ? 'active' : ''}
          onClick={() => handleClick('description')}
        >
          Description
        </button>
        <button
          className={activePanel === 'setup' ? 'active' : ''}
          onClick={() => handleClick('setup')}
        >
          Setup
        </button>
      </div>

      <div className="component">
        {activePanel === 'description' && <DescriptionComponent />}
        {activePanel === 'setup' && <Setup />}
      </div>
    </div>
  );
};




export default Profile;
