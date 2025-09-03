import React from 'react';
import { FiBell, FiMenu } from 'react-icons/fi'; 
import { BiSearch } from 'react-icons/bi';  

const TopRightBar = () => {
  return (
    <div style={styles.rightSection}>
      <div style={styles.searchBox}>
        <BiSearch size={18} color="#aaa" />
        <input
          type="text"
          placeholder="검색"
          style={styles.searchInput}
        />
      </div>
      <FiBell size={20} style={styles.icon} />
      <FiMenu size={22} style={styles.icon} />
    </div>
  );
};

const styles = {
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '20px',
    padding: '4px 12px',
    height: '32px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    marginLeft: '6px',
    fontSize: '14px',
  },
  icon: {
    cursor: 'pointer',
    color: '#333',
  }
};

export default TopRightBar;
