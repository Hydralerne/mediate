import React, { memo, useEffect, useRef } from 'react';

import { StyleSheet } from 'react-native';
import QRCodeStyled, {
    // isCoordsOfCornerDot,
    // isCoordsOfCornerSquare,
    RenderCustomPieceItem,
} from 'react-native-qrcode-styled';
import { Path } from 'react-native-svg';

const CustomPieces = ({ renderBackground, data, style, size = 8, padding = 20, callback }) => {
    const QRRef = useRef(null);

    const renderCustomPieceItem: RenderCustomPieceItem = ({ x, y, pieceSize, bitMatrix }) => {
        if (
            bitMatrix[y]?.[x] === 1
            // !isCoordsOfCornerSquare(x, y, bitMatrix.length) && // <-- add this if you want to exclude corner squares from svg
            // !isCoordsOfCornerDot(x, y, bitMatrix.length) // <-- add this if you want to exclude corner dot from svg
        ) {
            const c = Math.round(Math.random() * 120);

            return (
                <Path
                    fill={`rgb(${c},${c},${c})`}
                    key={`piece_${x}_${y}`}
                    d={`
          M${pieceSize * x} ${pieceSize * y} 
          L${pieceSize * (x + 1)} ${pieceSize * y} 
          L${pieceSize * (x + 1)} ${pieceSize * (y + 1)} 
          L${pieceSize * x} ${pieceSize * (y + 1)} z
        `}
                />
            );
        }

        return null;
    };

    useEffect(() => {
        const setData = async () => {
            try {
                if(!QRRef.current) return
                await new Promise(resolve => setTimeout(resolve, 1000))
                const code = await new Promise((resolve, reject) => {
                    QRRef.current?.toDataURL((result, error) => {
                        if (error) {
                            reject(error); 
                        } else {
                            resolve(result);
                        }
                    });
                });
                if (!code) {
                    return
                }
                callback(code)
            } catch (e) {
                console.log(e)
            }
        }
        setData()
    }, [QRRef])

    return (
        <QRCodeStyled
            ref={QRRef}
            data={data}
            style={[styles.svg, style]}
            padding={padding}
            pieceSize={size}
            renderCustomPieceItem={renderCustomPieceItem}
            renderBackground={renderBackground}
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


export default (CustomPieces)