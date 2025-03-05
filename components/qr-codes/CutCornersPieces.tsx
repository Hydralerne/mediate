import React from 'react';
import { StyleSheet } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';

export default function CutCornersPieces({ data }) {
  return (
    <QRCodeStyled
      data={data}
      style={styles.svg}
      padding={25}
      pieceSize={8}
      pieceCornerType={'cut'}
      pieceBorderRadius={[4, 0, 4]}
      isPiecesGlued
      color={'#59387e'}
    />
  );
}

const styles = StyleSheet.create({
  svg: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
