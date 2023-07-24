import React, { useEffect, useState } from 'react'
import styles from './SettingsBar.module.scss'


import { NavItem, Rendition } from 'epubjs'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import FontsContainer from './FontsContainerV2/FontsContainer'
import ThemesContainer from './ThemesContainer/ThemesContainer'
import SpacingContainer from './SpacingContainer/SpacingContainer'
import DisplayContainer from './DisplayContainer/DisplayContainer'

const menuExpanded = {
  transform: `translateY(100%)`,
  // width: "0%"
}

const SettingsBar = ()=>{
  const fontSize = useAppSelector((state) => state.bookState[0]?.data.theme.fontSize)
  const renditionInstance = useAppSelector((state) => state.bookState[0]?.instance)
  const dispatch = useAppDispatch()
  const [menu, setMenu] = useState("Fonts")
  const ThemeMenuActive = useAppSelector((state) => state.bookState[0]?.state?.themeMenuActive)
  const MenuToggled = useAppSelector((state) => state.bookState[0]?.state?.menuToggled)
  // const UIBackgroundColor = useAppSelector((state) => state.bookState[0]?.data?.theme?.backgroundColor)
  const ReaderBackgroundColor = useAppSelector((state) => {
    return state.appState.themes[state.appState.selectedTheme]?.reader?.body?.background

  })

  return (
    <div style={!MenuToggled?{backgroundColor:ReaderBackgroundColor}:{}} className={styles.overflowContainer}>
      <div style={{transform:!ThemeMenuActive?`translateY(100%)`:''}} className={styles.settingsBarContainer}>
        {/* <div className={styles.opaqueScreenActive}/> */}
        {/* <div className={styles.touchBar}/> */}

        <div className={styles.settingsContainer}>
        
          {DisplaySubpage(menu)}
        </div>

        <div className={styles.currentMenuContainer}>
          {['Fonts', 'Themes', "Spacing", "Display"].map((item,i)=>{
            return (
              // <div key={i} style={{color:item==menu?"#008DDD":"black"}} onClick={()=>setMenu(item)}> {item}</div>
              <div key={i} style={{opacity: item==menu?"100%":"50%"}} className={`${styles.tabSection}`} onClick={()=>setMenu(item)}> {item}</div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const DisplaySubpage = (pageName:string)=>{
  switch (pageName) {
  case "Fonts":
    return <FontsContainer/>
  case "Themes":
    return <ThemesContainer/>
  case "Spacing":
    return <SpacingContainer/>
  case "Display":
    return <DisplayContainer/>
  default:
    break;
  }
} 

export default SettingsBar