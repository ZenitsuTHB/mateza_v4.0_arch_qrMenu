import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaThumbtack } from 'react-icons/fa';

// Example routesConfig:
// Each route should have: { path: string, label: string, icon: ReactNode, isMenu: boolean, secondaryTopBar?: [{path:string, label:string}] }
// This is just a placeholder; replace with your actual routesConfig.
const routesConfig = [
  { path: '/dashboard', label: 'Dashboard', icon: FaAngleDoubleRight, isMenu: true },
  { path: '/settings', label: 'Settings', icon: FaAngleDoubleLeft, isMenu: true, 
    secondaryTopBar: [
      { path: '/settings/profile', label: 'Profile' },
      { path: '/settings/billing', label: 'Billing' }
    ]
  },
];

// Define 12 different color themes
// Each theme is an object of colors used throughout the sidebar
const colorThemes = [
  { // Theme 0: Dark Gray
    background: '#202020',
    text: '#f0f0f0',
    accent: '#616161',
    activeBg: '#333',
    border: '#444',
    hoverText: '#fff',
    tooltipBg: '#333',
    tooltipBorder: '#444'
  },
  { // Theme 1: Navy
    background: '#1e2a38',
    text: '#f0f7ff',
    accent: '#4a90e2',
    activeBg: '#2d3d50',
    border: '#3a4b5c',
    hoverText: '#ffffff',
    tooltipBg: '#2d3d50',
    tooltipBorder: '#3a4b5c'
  },
  { // Theme 2: Forest Green
    background: '#1f2f1e',
    text: '#eaf2e5',
    accent: '#6bbf59',
    activeBg: '#2a4029',
    border: '#3a4d3a',
    hoverText: '#ffffff',
    tooltipBg: '#2a4029',
    tooltipBorder: '#3a4d3a'
  },
  { // Theme 3: Maroon
    background: '#3a1f2b',
    text: '#fce8ed',
    accent: '#b45f7d',
    activeBg: '#4a2a38',
    border: '#5c3a4b',
    hoverText: '#ffffff',
    tooltipBg: '#4a2a38',
    tooltipBorder: '#5c3a4b'
  },
  { // Theme 4: Deep Purple
    background: '#201e3a',
    text: '#eae5f0',
    accent: '#6a5fb4',
    activeBg: '#2f2a4a',
    border: '#44415c',
    hoverText: '#ffffff',
    tooltipBg: '#2f2a4a',
    tooltipBorder: '#44415c'
  },
  { // Theme 5: Dark Blue
    background: '#1a1f3a',
    text: '#e5e8f0',
    accent: '#5f6ab4',
    activeBg: '#2a2f4a',
    border: '#3a3f5c',
    hoverText: '#ffffff',
    tooltipBg: '#2a2f4a',
    tooltipBorder: '#3a3f5c'
  },
  { // Theme 6: Olive
    background: '#2b2f1f',
    text: '#f2f2e5',
    accent: '#a5bf59',
    activeBg: '#3a3f2a',
    border: '#4b4d3a',
    hoverText: '#ffffff',
    tooltipBg: '#3a3f2a',
    tooltipBorder: '#4b4d3a'
  },
  { // Theme 7: Teal
    background: '#1e3a3a',
    text: '#e5f0f0',
    accent: '#59b4a5',
    activeBg: '#2a4a4a',
    border: '#3a5c5c',
    hoverText: '#ffffff',
    tooltipBg: '#2a4a4a',
    tooltipBorder: '#3a5c5c'
  },
  { // Theme 8: Dark Brown
    background: '#3a2f1e',
    text: '#f2ede5',
    accent: '#b48f59',
    activeBg: '#4a3f2a',
    border: '#5c4d3a',
    hoverText: '#ffffff',
    tooltipBg: '#4a3f2a',
    tooltipBorder: '#5c4d3a'
  },
  { // Theme 9: Dark Red
    background: '#3a1f1f',
    text: '#f0e5e5',
    accent: '#b45f5f',
    activeBg: '#4a2a2a',
    border: '#5c3a3a',
    hoverText: '#ffffff',
    tooltipBg: '#4a2a2a',
    tooltipBorder: '#5c3a3a'
  },
  { // Theme 10: Charcoal
    background: '#2a2a2a',
    text: '#f0f0f0',
    accent: '#7f7f7f',
    activeBg: '#3a3a3a',
    border: '#4a4a4a',
    hoverText: '#ffffff',
    tooltipBg: '#3a3a3a',
    tooltipBorder: '#4a4a4a'
  },
  { // Theme 11: Dark Cyan
    background: '#1e3a3f',
    text: '#e5f0f2',
    accent: '#5fa5bf',
    activeBg: '#2a4a50',
    border: '#3a5c6c',
    hoverText: '#ffffff',
    tooltipBg: '#2a4a50',
    tooltipBorder: '#3a5c6c'
  },
];

// Select which theme to use by changing this index:
const currentThemeIndex = 11; 
const theme = colorThemes[currentThemeIndex];

// SidebarItem component
const SidebarItem = ({
  item,
  activeTab,
  handleItemClick,
  isExpanded,
  isPinned,
  secondaryTopBar,
}) => {
  const [showSecondaryItems, setShowSecondaryItems] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [tooltipDisabled, setTooltipDisabled] = useState(false);
  const IconComponent = item.icon;

  const handleMouseEnter = () => {
    if (secondaryTopBar && isExpanded && !isPinned) {
      const timeout = setTimeout(() => {
        setShowSecondaryItems(true);
      }, 500);
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    if (!isPinned) {
      setShowSecondaryItems(false);
    }
    setTooltipDisabled(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  useEffect(() => {
    if (isPinned) setShowSecondaryItems(true);
    else setShowSecondaryItems(false);
  }, [isPinned]);

  const containerVariants = {
    hidden: { opacity: 0, height: 0, transition: { when: 'afterChildren' } },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { when: 'beforeChildren', staggerChildren: 0.1 },
    },
    exit: { opacity: 0, height: 0, transition: { when: 'afterChildren' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };

  const handleItemClickWrapper = (id) => {
    handleItemClick(id);
    if (isExpanded && !isPinned) {
      setTooltipDisabled(true);
    }
  };

  const isActive =
    activeTab === item.id ||
    (secondaryTopBar && secondaryTopBar.some((subItem) => subItem.path === activeTab));

  const sidebarItemStyle = {
    position: 'relative',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: '500',
    color: theme.text,
    transition: 'background-color 0.4s ease, color 0.4s ease',
  };

  const sidebarItemActiveBgStyle = {
    position: 'absolute',
    inset: '0',
    borderRadius: '10px',
    backgroundColor: theme.activeBg,
  };

  const sidebarItemContentStyle = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  };

  const sidebarItemIconStyle = {
    display: 'flex',
    alignItems: 'center',
    color: isActive ? theme.accent : theme.accent,
    transition: 'color 0.3s ease, transform 0.3s ease',
    fontSize: '1.2rem',
  };

  const sidebarItemTextStyle = {
    marginLeft: '12px',
    color: theme.text,
    fontWeight: '500',
  };

  const tooltipStyle = {
    position: 'absolute',
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%) translateX(18px)',
    backgroundColor: theme.tooltipBg,
    color: theme.text,
    padding: '4px 8px',
    borderRadius: '4px',
    border: `1px solid ${theme.tooltipBorder}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    whiteSpace: 'nowrap',
    opacity: '0',
    visibility: 'hidden',
    backdropFilter: 'blur(30px)',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
  };

  const sidebarItemSecondaryStyle = {
    marginTop: '5px',
    marginLeft: '20px',
    fontSize: '0.9em',
    display: 'flex',
    flexDirection: 'column',
  };

  const sidebarItemSecondaryItemStyle = {
    padding: '5px 0 5px 20px',
    cursor: 'pointer',
    color: theme.text,
    transition: 'color 0.3s ease',
  };

  return (
    <motion.div
      className="sidebar-item-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      layout
      style={{ position: 'relative' }}
    >
      <motion.div
        layout
        className={clsx('sidebar-item', { 'sidebar-item__active': isActive })}
        style={sidebarItemStyle}
        onClick={() => handleItemClickWrapper(item.id)}
        onMouseEnter={(e) => {
          const iconElem = e.currentTarget.querySelector('.sidebar-item__icon');
          if (iconElem) {
            iconElem.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          const iconElem = e.currentTarget.querySelector('.sidebar-item__icon');
          if (iconElem) {
            iconElem.style.transform = 'scale(1)';
          }
        }}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-item-indicator"
            className="sidebar-item__active-bg"
            style={sidebarItemActiveBgStyle}
          />
        )}
        <div className="sidebar-item__content" style={sidebarItemContentStyle}>
          <span className="sidebar-item__icon" style={sidebarItemIconStyle}>
            <IconComponent />
          </span>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                className="sidebar-item__text"
                style={sidebarItemTextStyle}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                {item.title}
              </motion.span>
            )}
          </AnimatePresence>
          {!isExpanded && !tooltipDisabled && (
            <span
              className="tooltip"
              style={tooltipStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.visibility = 'visible';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0';
                e.currentTarget.style.visibility = 'hidden';
              }}
            >
              {item.title}
            </span>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {secondaryTopBar && showSecondaryItems && isExpanded && (
          <motion.div
            className="sidebar-item__secondary"
            style={sidebarItemSecondaryStyle}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
            layout
          >
            {secondaryTopBar.map((subItem) => (
              <motion.div
                key={subItem.path}
                className={clsx('sidebar-item__secondary-item', {
                  'sidebar-item__secondary-item--active': activeTab === subItem.path,
                })}
                style={{
                  ...sidebarItemSecondaryItemStyle,
                  color: activeTab === subItem.path ? theme.accent : theme.text,
                }}
                onClick={() => handleItemClickWrapper(subItem.path)}
                variants={itemVariants}
                transition={{ duration: 0.2 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.accent)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    activeTab === subItem.path ? theme.accent : theme.text)
                }
              >
                {subItem.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Sidebar component
const Sidebar = () => {
  const isIframe = typeof window !== 'undefined' && window.isIframe;
  const [isExpanded, setIsExpanded] = useState(() => window.innerWidth >= 900);
  const [isPinned, setIsPinned] = useState(false);
  const [activeTab, setActiveTab] = useState(routesConfig[0].path);
  const [collapseTimeout, setCollapseTimeout] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (path) => {
    setActiveTab(path);
    navigate(path);
    if (isExpanded && !isPinned) setIsExpanded(false);
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
    if (isExpanded && isPinned) setIsPinned(false);
  };

  const togglePin = () => {
    setIsPinned((prev) => !prev);
  };

  const handleMouseEnter = () => {
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
  };

  const handleMouseLeave = () => {
    if (isExpanded && !isPinned) {
      const timeout = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      setCollapseTimeout(timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (collapseTimeout) clearTimeout(collapseTimeout);
    };
  }, [collapseTimeout]);

  useEffect(() => {
    const adjustPadding = () => {
      const elements = document.querySelectorAll('.withHeader');
      elements.forEach((el) => {
        if (isPinned) {
          el.style.paddingLeft = '200px';
        } else {
          el.style.paddingLeft = isExpanded ? '200px' : '60px';
        }
      });
    };
    const timeoutId = setTimeout(adjustPadding, 0);
    return () => {
      clearTimeout(timeoutId);
      document.querySelectorAll('.withHeader').forEach((el) => {
        el.style.paddingLeft = '';
      });
    };
  }, [isExpanded, isPinned, activeTab, location.pathname]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const mobile = window.innerWidth < 900;
      if (mobile) setIsExpanded(false);
    }, 100);
    return () => clearInterval(intervalId);
  }, [isPinned]);

  if (isIframe) return null;

  const sidebarStyle = {
    position: 'fixed',
    top: '60px',
    left: '0',
    bottom: '0',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    backgroundColor: theme.background,
    padding: '10px 4px',
    width: isExpanded ? '200px' : '60px',
    transition: 'width 0.3s ease',
    color: theme.text,
    overflowY: isExpanded ? 'auto' : 'hidden',
    borderRight: isExpanded ? `1px solid ${theme.border}` : 'none',
  };

  const sidebarControlsStyle = {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const sidebarToggleGroupStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  };

  const toggleStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: theme.accent,
    padding: '10px',
    transition: 'color 0.3s ease',
  };

  return (
    <motion.div
      className={`sidebar-component ${isExpanded ? 'expanded' : ''}`}
      layout
      style={sidebarStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {routesConfig
        .filter((route) => route.isMenu)
        .map((route) => (
          <SidebarItem
            key={route.path}
            item={{ id: route.path, title: route.label, icon: route.icon }}
            activeTab={activeTab}
            handleItemClick={handleItemClick}
            isExpanded={isExpanded}
            isPinned={isPinned}
            secondaryTopBar={route.secondaryTopBar}
          />
        ))}

      <div className="sidebar-controls" style={sidebarControlsStyle}>
        <div className="sidebar-toggle-group" style={sidebarToggleGroupStyle}>
          <div
            className="sidebar-toggle"
            style={toggleStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.hoverText)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.accent)}
            onClick={toggleSidebar}
          >
            {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="sidebar-pin"
                style={toggleStyle}
                onClick={togglePin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.hoverText)}
                onMouseLeave={(e) => (e.currentTarget.style.color = theme.accent)}
              >
                <FaThumbtack color={isPinned ? theme.accent : 'inherit'} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
