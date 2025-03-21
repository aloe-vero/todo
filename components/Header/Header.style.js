import { StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from '../../theme';
export const light = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.headerBg,
    flexDirection: 'row',
    height:100,
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  logo: {
    paddingLeft: 10,
    paddingTop: 10,
    width: 250,
    height:110,

  },

  img: {width: 160, flex: 1},
  text: {flex: 1, color: 'grey'},
  levelBanner:{ flexDirection: 'row', alignItems: 'center', marginRight: 30, gap:5   },
  bannerText:{color:"white", fontWeight:'bold', fontSize:16, borderRadius: 20 ,width:"fit-content", padding:10,},




});

export const dark = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.headerBg,
    flexDirection: 'row',
    height:100,
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  logo: {
     paddingLeft: 10,
    paddingTop: 10,
    width: 250,
    height:110,
    border:"1px solid white",
  },

  img: {width: 160, flex: 1},
  text: {flex: 1, color: 'grey'},
  levelBanner:{ flexDirection: 'row', alignItems: 'center', marginRight: 30, gap:5   },
  bannerText:{color:"white", fontWeight:'bold', fontSize:16, borderRadius: 20 ,width:"fit-content", padding:10,},

});
