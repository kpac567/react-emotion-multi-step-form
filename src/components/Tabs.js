/** @jsx jsx */
import { useState, useEffect, useRef } from "react";
import { jsx, css, keyframes } from "@emotion/core";
import styled from "@emotion/styled";

import { BackButtonIcon } from "./StyledComponents";

import { createScaleKeyframeAnimation } from "../utils/createKeyFrameAnimation";

const TabsContainer = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  max-width: ${props => props.isSubmitPage ? '500px' : '500px'};
  line-height: 30px;
  ${props => css`
    transform-origin: center top;
    animation-name: ${keyframes(props.scaleAnimation)};
    animation-duration: 400ms;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  `}
`
// ${props => props.isSubmitPage ? `
//   max-width: 40px;
//   transition: max-width 300ms ease-out;
// ` : `
//   max-width: 500px;
//   transition: max-width 150ms ease-out;
// `}

const TabsWrapper = styled.div`
  flex: 0 1 450px;
  display: inline-flex;
  padding: 0 10px;
  text-align: center;
  ${props => props.isSubmitPage ? `
    z-index: -1;
    opacity: 0;
    visibility: hidden;
    transition: opacity 200ms ease-in-out 100ms, visibility 0ms linear 400ms;
  ` : `
    opacity: 1;
    visibility: visible;
  `}
`

const StyledTab = styled.li`
  position: relative;
  flex: 1 1 0;
  border-top-right-radius: 17px 25px;
  border-top-left-radius: 17px 25px;
  z-index: ${props => props.zIndex};
  box-shadow: 0 10px 10px rgba(0, 0, 0, .5);
  background: hsl(0, 0%, 87%);
  list-style: none;
  font-weight: 500;
  label {
    pointer-events: none;
  }
  &::before, &::after {
    content: '';
    position: absolute;
    top: 0px;
    width: 20px;
    height: 20px;
    border: 10px solid hsl(0, 0%, 87%);
    border-radius: 100%;
    background: transparent;
  }
  &::before {
    left: -30px;
    clip-path: inset(50% 0 0 50%);
  }
  &::after {
    right: -30px;
    clip-path: inset(50% 50% 0 0);
  }  
  ${props => props.active ? `
    z-index: 10;
    background: hsl(0, 0%, 100%);
    &::before, &::after {
      border-color: hsl(0, 0%, 100%);
    }
  ` : props.activated ? `
    cursor: pointer;
    &:hover {
      z-index: 10;
      background: hsl(0, 0%, 100%);
    }
    &:hover::before, &:hover::after {
      border-color: hsl(0, 0%, 100%);
    }
  ` : `
  `}
`

const StyledIconTab = styled.button`
  position: relative;
  top: 0;
  flex: ${props => props.isSubmitPage ? 'none' : '1 1 auto'};
  min-width: ${props => props.isSubmitPage ? '50px' : '40px'};
  height: 30px;
  border: 0;
  margin: 0;
  padding: 0;
  border-top-left-radius: 30px 30px;
  border-top-right-radius: 30px 30px;
  background: hsl(0, 0%, 100%);
  cursor: pointer;
  transition: transform 300ms;
  ${props => !props.active ? `
    transform: translateY(30px);
    visibility: hidden;
    transition: transform 300ms, visibility 0ms ease 300ms;
  `: `
  `}
  &:focus {
    outline: none;
    border: 2px solid ${props => props.theme.colors.light.indigo};
  }
  div {
    opacity: .5;
  }
  &:hover div, &:focus div {
    opacity: .75;
  }
  ${props => css`
    transform-origin: right top;
    animation-name: ${keyframes(props.inverseScaleAnimation)};
    animation-duration: 400ms;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  `}
`

const LabelTab = ({ htmlFor, label, zIndex, active, changeActiveIndex }) => {
  const [activated, setActivated] = useState(false);

  const handleClick = event => {
    if (activated && !active) {
      // console.log('click!');
      changeActiveIndex();
    }
  }

  useEffect(() => {
    if (active && !activated) {
      setActivated(true);
    }
  }, [active, activated])

  return (
    <StyledTab
      zIndex={zIndex}
      active={active}
      activated={activated}
      onClick={handleClick}
    >
      <label htmlFor={htmlFor}>{label}</label>
    </StyledTab>
  )
}

const BackTab = ({ zIndex, active, changeActiveIndex, isSubmitPage, inverseScaleAnimation }) => {
  const handleClick = event => {
    if (active) {
      // console.log('click!');
      changeActiveIndex();
    }
  }

  return (
    <StyledIconTab
      zIndex={zIndex}
      active={active}
      onClick={handleClick}
      isSubmitPage={isSubmitPage}
      inverseScaleAnimation={inverseScaleAnimation}
    >
      <BackButtonIcon />
    </StyledIconTab>
  )
}

const Tabs = ({ inputs, activeIndex, changeActiveIndex, activeInput, isSubmitPage }) => {
  console.log('Tabs rendered');
  const tabContainerRef = useRef();
  const boundingClientRectRef = useRef();
  const oldPageXScaleRef = useRef(1);

  const newPageXScale = isSubmitPage ? 50 / boundingClientRectRef.current.width : 1;
  console.log(newPageXScale);
  const [scaleAnimation, inverseScaleAnimation] = createScaleKeyframeAnimation(
    { x: oldPageXScaleRef.current, y: 1 },
    { x: newPageXScale, y: 1 }
  );

  useEffect(() => {
    if (boundingClientRectRef.current) return;
    console.log('Calculate original width effect run');
    if (activeInput) {
      const boundingClientRect = tabContainerRef.current.getBoundingClientRect();
      boundingClientRectRef.current = boundingClientRect;
      console.log(boundingClientRectRef.current);
      // oldPageRelativeHeight.current = newPageRelativeHeight;
      // console.log(oldPageRelativeHeight.current);
    }
  }, [activeInput]);

  useEffect(() => {
    console.log('Set oldPageRelativeHeight and Width effect run');
    if (activeInput || isSubmitPage) {
      oldPageXScaleRef.current = newPageXScale;
    }
  }, [activeInput]);

  return (
    <TabsContainer ref={tabContainerRef} isSubmitPage={isSubmitPage} scaleAnimation={scaleAnimation}>
      <TabsWrapper isSubmitPage={isSubmitPage}>
        {(inputs.length > 0) ?
          inputs.map((input, index) => (
            <LabelTab
              key={`${index}${input.name}`}
              htmlFor={input.name}
              label={input.label}
              zIndex={inputs.length - index}
              active={index === activeIndex}
              changeActiveIndex={() => changeActiveIndex(index)}
            />
          ))
          : null
        }
      </TabsWrapper>
      <BackTab
        key="back-button"
        zIndex={10}
        active={activeIndex > 0}
        changeActiveIndex={() => changeActiveIndex(activeIndex - 1)}
        isSubmitPage={isSubmitPage}
        inverseScaleAnimation={inverseScaleAnimation}
      />
    </TabsContainer>
  )
}

export default Tabs;