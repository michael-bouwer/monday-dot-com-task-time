import React from "react";
import { Col, Row } from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import { useSpring, animated } from "react-spring";
import "./styles.scss";

function UserTimesheet({ user, goBack }) {
  const props = useSpring({    
    to: { marginLeft: 0, opacity: 1 },
    from: { marginLeft: 50, opacity: 0 },
  });
  return (
    <animated.div style={props}>
      <Row>
        <Col>
          <div className="center-all justify-content-start">
            <IconButton
              style={{ marginLeft: "-16px" }}
              aria-label="upload picture"
              component="span"
              onClick={() => goBack()}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
            <span className="text-subtitle-18 ml-2">{user.name}</span>
          </div>
        </Col>
      </Row>
    </animated.div>
  );
}

export default UserTimesheet;
