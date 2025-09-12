function EvaluationBar({value}) {
const evalclamp = Math.max(-10,Math.min(10,value));
const percent =  ((evalclamp +10)/20) * 100;
  return (
    <div style={{
      width: '30px',
      height: '500px',
      background: 'linear-gradient(to top, #222 0%, #fff 100%)',
      borderRadius: '8px',
      borderColor: 'black',
      borderWidth: '5px',
      borderStyle: 'solid',
      position: 'relative',
      marginLeft: '16px'
    }}>
      <div style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: `${percent}%`,
        background: evalclamp >= 0 ? '#fff' : '#222',
        borderRadius: '8px'
      }} />
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