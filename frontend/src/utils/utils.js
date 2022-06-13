function getRandomInt(max) {
  return Math.random() * max;
}

export const getsuhu = (suhu) => {
  const changeSuhu  = parseFloat((getRandomInt(1)).toFixed(2))

  if(getRandomInt(1)<0.5){
      return suhu - changeSuhu
  }else {
      return suhu + changeSuhu

  }
}