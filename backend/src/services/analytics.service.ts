import { Cerebras } from '@cerebras/cerebras_cloud_sdk';
import Payment from '../models/payment.model.js';
import User from '../models/user.model.js';

const cerebras = new Cerebras({
  apiKey: process.env['CEREBRAS_API_KEY']
});

export const generateAnalytics = async (userAddress: string) => {
  try {
    // Find user by address
    const user = await User.findOne({ address: userAddress });
    if (!user) {
      return {
        paymentPatterns: "User not found. Please connect your wallet first.",
        successRate: "No data available",
        activeDays: "No activity recorded",
        incomeVsExpenses: "No financial data available",
        recommendations: "Connect your wallet to start tracking payments",
        anomalies: "No data to analyze"
      };
    }

    // Get user's payment data
    const payments = await Payment.find({ userId: user._id }).sort({ createdAt: -1 });

    // If no payments, return basic analytics
    if (payments.length === 0) {
      return {
        paymentPatterns: "No payment data available yet. Start making payments to see insights.",
        successRate: "No payments to analyze",
        activeDays: "No activity recorded",
        incomeVsExpenses: "No financial data available",
        recommendations: "Create your first payment to unlock AI analytics",
        anomalies: "No data to analyze"
      };
    }

    // Calculate basic stats
    const totalPayments = payments.length;
    const completedPayments = payments.filter(p => p.status === 'completed').length;
    const successRate = totalPayments > 0 ? Math.round((completedPayments / totalPayments) * 100) : 0;

    const receivedPayments = payments.filter(p => p.isPaymentRequest && p.status === 'completed');
    const sentPayments = payments.filter(p => !p.isPaymentRequest && p.status === 'completed');

    const totalReceived = receivedPayments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
    const totalSent = sentPayments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

    // For now, return calculated analytics without AI
    return {
      paymentPatterns: `You have ${totalPayments} total payments. ${receivedPayments.length} incoming and ${sentPayments.length} outgoing transactions.`,
      successRate: `${successRate}% of your payments are completed successfully (${completedPayments}/${totalPayments}).`,
      activeDays: "Payment activity analysis available with more data.",
      incomeVsExpenses: `You've received ${totalReceived.toFixed(2)} XLM and sent ${totalSent.toFixed(2)} XLM. Net: ${(totalReceived - totalSent).toFixed(2)} XLM.`,
      recommendations: successRate < 80 ? "Consider reviewing pending payments to improve completion rate." : "Your payment completion rate is excellent!",
      anomalies: "No anomalies detected in current payment patterns."
    };

    // TODO: Uncomment when Cerebras API is working
    /*
    // Create prompt for Cerebras
    const prompt = `Analyze the following payment data for a user and provide insights:

Payment Data Summary:
- Total payments: ${totalPayments}
- Completed payments: ${completedPayments}
- Success rate: ${successRate}%
- Total received: ${totalReceived} XLM
- Total sent: ${totalSent} XLM

Please provide detailed analytics including:
1. Payment patterns and trends
2. Success rates and completion statistics
3. Most active payment days/times
4. Income vs expenses analysis
5. Recommendations for improving payment flow
6. Any anomalies or unusual patterns

Format the response as a JSON object with the following structure:
{
  "paymentPatterns": "string description",
  "successRate": "string with percentage and analysis",
  "activeDays": "string description of most active periods",
  "incomeVsExpenses": "string analysis",
  "recommendations": "string with actionable suggestions",
  "anomalies": "string description of any unusual patterns"
}`;

    const stream = await cerebras.chat.completions.create({
      messages: [
        {
          "role": "system",
          "content": "You are an expert financial analyst specializing in payment data analysis. Provide clear, actionable insights based on the data provided. Always respond with valid JSON."
        },
        {
          "role": "user",
          "content": prompt
        }
      ],
      model: 'llama3.1-70b',
      stream: true,
      max_completion_tokens: 2048,
      temperature: 0.7,
      top_p: 1,
      reasoning_effort: "medium"
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = (chunk as any).choices?.[0]?.delta?.content || '';
      fullResponse += content;
    }

    // Try to parse as JSON, if not return as text
    try {
      const analytics = JSON.parse(fullResponse);
      return analytics;
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', fullResponse);
      // If not valid JSON, return structured fallback
      return {
        paymentPatterns: `You have ${totalPayments} total payments with a ${successRate}% success rate.`,
        successRate: `${successRate}% of your payments are completed successfully.`,
        activeDays: "Activity data is being analyzed...",
        incomeVsExpenses: `You've received ${totalReceived} XLM and sent ${totalSent} XLM.`,
        recommendations: "Keep using the platform to build more payment history for better insights.",
        anomalies: "No anomalies detected in current data."
      };
    }
    */

  } catch (error) {
    console.error('Error generating analytics:', error);
    return {
      paymentPatterns: "Error analyzing payment patterns",
      successRate: "Unable to calculate success rate",
      activeDays: "Activity analysis unavailable",
      incomeVsExpenses: "Financial analysis unavailable",
      recommendations: "Please try again later",
      anomalies: "Analysis failed"
    };
  }
};