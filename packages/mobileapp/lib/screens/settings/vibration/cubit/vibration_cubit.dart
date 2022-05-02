import 'package:equatable/equatable.dart';
import 'package:flutter_vibrate/flutter_vibrate.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:json_annotation/json_annotation.dart';

part 'vibration_state.dart';
part 'vibration_cubit.g.dart';

class VibrationCubit extends HydratedCubit<VibrationState> {
  VibrationCubit() : super(const VibrationState());

  void updatePreference(VibrationType type, bool value) {
    switch (type) {
      case VibrationType.onVote:
        emit(state.copyWith(onVote: value));
        break;
      case VibrationType.onNewNoun:
        emit(state.copyWith(onNewNoun: value));
        break;
    }
  }

  void newNoun() async {
    if (state.onNewNoun && await Vibrate.canVibrate) {
      Vibrate.feedback(FeedbackType.medium);
    }
  }

  void voteButtonClick() async {
    if (state.onVote && await Vibrate.canVibrate) {
      Vibrate.feedback(FeedbackType.light);
    }
  }

  @override
  VibrationState? fromJson(Map<String, dynamic> json) =>
      VibrationState.fromJson(json);

  @override
  Map<String, dynamic>? toJson(VibrationState state) => state.toJson();
}
