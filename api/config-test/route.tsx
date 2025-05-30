({
      success: true,
      quizId: quiz.id,
      message: "Quiz created successfully"
    });
  } catch (error) {
    console.error('[Manual Quiz API] Error in quiz creation:', error);
    return NextResponse.json(
      { error: "Failed to create quiz", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 