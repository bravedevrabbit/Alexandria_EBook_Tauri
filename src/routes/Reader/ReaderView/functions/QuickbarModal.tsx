import React from 'react'; // we need this to make JSX compile


import {
  AddHighlight, 
  SetModalCFI,
  MoveQuickbarModal,
  SkipMouseEvent,
  ShowNoteModal,
  MoveNoteModal,
  SetDictionaryWord,
  
} from '@store/slices/bookState'

// Transferred Imports
import styles from './DialogPopup.module.scss'
import Copy from '@resources/iconmonstr/iconmonstr-copy-9.svg'
import Book from '@resources/iconmonstr/iconmonstr-book-26.svg'
import Search from '@resources/iconmonstr/iconmonstr-magnifier-2.svg'

import { useAppSelector, useAppDispatch } from '@store/hooks';
import { CalculateBoxPosition, NOTE_MODAL_HEIGHT, NOTE_MODAL_WIDTH, QUICKBAR_MODAL_HEIGHT, QUICKBAR_MODAL_WIDTH } from './ModalUtility';
import { Rendition } from 'epubjs';


const COLORS = ['#FFD600', 'red', 'orange','#00FF29', 'cyan']


const QuickbarModal = () =>{

  const quickbarModalVisible = useAppSelector((state) => state.bookState[0]?.state?.modals.quickbarModal.visible)
  const modalX = useAppSelector((state) => state.bookState[0]?.state?.modals.quickbarModal.x)
  const modalY = useAppSelector((state) => state.bookState[0]?.state?.modals.quickbarModal.y)
  const selectedCFI = useAppSelector((state) => state.bookState[0]?.state?.modals.selectedCFI)
  const renditionInstance:Rendition = useAppSelector((state) => state.bookState[0]?.instance)


  function getEpubBounds(){
    return renditionInstance?.manager?.container?.getBoundingClientRect();
  }



  const dispatch = useAppDispatch()
  if(quickbarModalVisible){
    return(
      <>
        <div className={styles.container} style={{top:modalY, left: modalX, width: QUICKBAR_MODAL_WIDTH, height: QUICKBAR_MODAL_HEIGHT}}>
          <div className={styles.actionContainer}>
            <div><Copy/></div>
            <div><Book onClick={()=>{
              
              let result:any = renditionInstance.getRange(selectedCFI)
              type EpubJSContainer = Node & {data: string}
              result = (result.endContainer as EpubJSContainer).data.substring(result.startOffset, result.endOffset)

              dispatch(SetDictionaryWord({view:0, word:result}))
              renditionInstance.annotations.remove(selectedCFI, "highlight")
              dispatch(MoveQuickbarModal({
                view: 0,
                x:0,
                y:0,
                visible: false
              }))

            }}/></div>
            <div><Search/></div>
          </div>
          <hr className={styles.divider}/>
          <div className={styles.highlightContainer}>
            {COLORS.map((item)=>{

              return <div key={item} style={{backgroundColor:item}} className={styles.highlightBubble} onClick={()=>{
                renditionInstance.annotations.remove(selectedCFI, "highlight")

                const cfiRangeClosure = selectedCFI
                console.log("ANNOTATION MADE", cfiRangeClosure)
                renditionInstance.annotations.highlight(selectedCFI,{}, (e:MouseEvent) => {
                  console.log("ANNOTATION CLICKED", cfiRangeClosure)

                  // This will prevent page turning when clicking on highlight
                  dispatch(SkipMouseEvent(0))
        

                  const {x, y} = CalculateBoxPosition(renditionInstance, cfiRangeClosure, NOTE_MODAL_WIDTH, NOTE_MODAL_HEIGHT)

                  dispatch(SetModalCFI({view:0,selectedCFI:cfiRangeClosure}))
                  dispatch(MoveNoteModal({
                    view: 0,
                    x,
                    y,
                    visible: true
                  }))

                  
                }, '', {fill:item});


                dispatch(MoveQuickbarModal({
                  view: 0,
                  x:0,
                  y:0,
                  visible: false
                }))

                dispatch(ShowNoteModal(0))
                
                dispatch(AddHighlight({highlightRange:selectedCFI, color:item, note:"", view:0}))
              }}/>


            })}
  
          </div>
        </div>
      </>

    )
  }
  return null
} 


export default QuickbarModal

