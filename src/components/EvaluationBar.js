function EvaluationBar({value}) {
const evalclamp = Math.max(-10,Math.min(10,value));
const percent =  ((evalclamp +10)/20) * 100;
const revpercent = 100-percent;
  return (
    <div style={{
      width: '30px',
      height: '500px',
      background: 'grey',
      borderRadius: '8px',
      borderColor: 'black',
      borderWidth: '5px',
      borderStyle: 'solid',
      position: 'relative',
      marginLeft: '16px'
    }}>
      
      <div style = {{
        position: 'relative',
        left: 0,
        width: '100%',
        height :`${percent}%`,
        background:'#fff'
      }}/>
      <div style = {{
        position: 'relative',
       
        left: 0,
        width: '100%',
        height :`${revpercent}%`,
        background:'black'
      }}/>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '100%',
        transform: 'translateY(-50%)',
        fontSize: '14px',
        marginLeft: '8px'
      }}>
        {value !== undefined ? value : 'N/A'}
      </div>
    </div>
  );
}
export default EvaluationBar;